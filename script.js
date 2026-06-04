  // ─────────────────────────────────────────────────────────
  //  REAL PHOTO IMAGE SYSTEM — Wikipedia thumbnails via API
  //  Falls back to OpenMoji SVG → native emoji
  // ─────────────────────────────────────────────────────────

  // Map week number → Wikipedia article title to query for a photo
  const WEEK_WIKI = {
    1:  'Fertilisation',       2:  'Zygote',
    3:  'Blastocyst',          4:  'Poppy seed',
    5:  'Sesame',              6:  'Pea',
    7:  'Blueberry',           8:  'Raspberry',
    9:  'Grape',               10: 'Kumquat',
    11: 'Lime (fruit)',        12: 'Plum',
    13: 'Peach',               14: 'Lemon',
    15: 'Apple',               16: 'Avocado',
    17: 'Pear',                18: 'Bell pepper',
    19: 'Mango',               20: 'Banana',
    21: 'Carrot',              22: 'Coconut',
    23: 'Grapefruit',          24: 'Sweet corn',
    25: 'Turnip',              26: 'Lettuce',
    27: 'Cauliflower',         28: 'Eggplant',
    29: 'Cucumber',            30: 'Cabbage',
    31: 'Coconut',             32: 'Butternut squash',
    33: 'Pineapple',           34: 'Cantaloupe',
    35: 'Honeydew (melon)',    36: 'Romaine lettuce',
    37: 'Rhubarb',             38: 'Winter melon',
    39: 'Watermelon',          40: 'Pumpkin',
    41: 'Jackfruit',           42: 'Durian'
};

  // Cache: week number → confirmed thumbnail URL (populated by loadWeekImages)
  var WIKI_IMGS = {};
  var _wikiLoaded = false;
  var _wikiPending = []; // callbacks waiting for load to finish

  function loadWeekImages() {
    if (_wikiLoaded) return Promise.resolve();
    return new Promise(function(resolve) {
      _wikiPending.push(resolve);
      if (_wikiPending.length > 1) return; // already in flight

      // De-duplicate titles and build batch query (Wikipedia supports up to 50 titles with |)
      var uniqueTitles = [];
      var seen = {};
      Object.values(WEEK_WIKI).forEach(function(t) {
        if (!seen[t]) { seen[t] = true; uniqueTitles.push(t); }
    });

      var url = 'https://en.wikipedia.org/w/api.php?action=query&titles=' +
        uniqueTitles.map(encodeURIComponent).join('|') +
        '&prop=pageimages&piprop=thumbnail&pithumbsize=200&format=json&origin=*';

      fetch(url)
        .then(function(r) { return r.json(); })
        .then(function(data) {
          // Build title → img URL map (normalised titles may differ from query)
          var titleMap = {};
          var pages = data.query.pages;
          // Handle normalisation redirects
          var norm = {};
          if (data.query.normalized) {
            data.query.normalized.forEach(function(n) { norm[n.from] = n.to; });
        }
          if (data.query.redirects) {
            data.query.redirects.forEach(function(rd) { norm[rd.from] = rd.to; });
        }
          Object.values(pages).forEach(function(pg) {
            if (pg.thumbnail) titleMap[pg.title] = pg.thumbnail.source;
        });

          // Populate WIKI_IMGS by week
          Object.keys(WEEK_WIKI).forEach(function(wk) {
            var rawTitle = WEEK_WIKI[wk];
            var resolvedTitle = norm[rawTitle] || rawTitle;
            if (titleMap[resolvedTitle]) {
              WIKI_IMGS[wk] = titleMap[resolvedTitle];
          } else if (titleMap[rawTitle]) {
              WIKI_IMGS[wk] = titleMap[rawTitle];
          }
        });
      })
        .catch(function() { /* Silently fall back to emoji on network error */ })
        .finally(function() {
          _wikiLoaded = true;
          _wikiPending.forEach(function(cb) { cb(); });
          _wikiPending = [];
      });
  });
}

  // Call once on page load so images are ready before user taps a week
  // Wikipedia loading disabled
  // loadWeekImages();

  // Photo-based scale view disabled for now
  const AI_SCALE_WEEKS = [];

  // Render a week's image: local week photo → OpenMoji SVG fallback
  const LOCAL_WEEK_PHOTO_MAX = 42;
  function localWeekPhoto(wkNum, type) {
    if (!type || (type !== 'fruit' && type !== 'object')) return null;
    if (wkNum < 1 || wkNum > LOCAL_WEEK_PHOTO_MAX) return null;
    var padded = String(wkNum).padStart(2, '0');
    return 'assets/week-photos/week_' + padded + '_' + type + '.png';
  }

  function weekImg(wkNum, emoji, imageType) {
    wkNum = Number(wkNum);
    var points = [];
    for (var i = 0; i < emoji.length; ) {
      var code = emoji.codePointAt(i);
      if (code !== 0xFE0F) points.push(code.toString(16).toUpperCase());
      i += code > 0xFFFF ? 2 : 1;
  }
    var cp = points.join('-');
    var fallback = 'https://cdn.jsdelivr.net/npm/openmoji@14.0.0/color/svg/' + cp + '.svg';
    var local = localWeekPhoto(wkNum, imageType);
    if (local) {
      return '<img class="emoji-img week-photo" src="' + local + '" alt="Week ' + wkNum + ' ' + imageType + ' photo" loading="lazy" draggable="false">';
    }
    return '<img class="emoji-img" src="' + fallback + '" alt="' + emoji + '" loading="lazy" draggable="false" onerror="this.parentNode.innerHTML=\'<span style=font-size:3.5rem>\'+\'' + emoji + '\'+ \'</span>\'">';
}

  // Keep tw() as legacy alias so nothing breaks
  function tw(emoji) { return weekImg(0, emoji); }

  // ─────────────────────────────────────────────────────────
  //  WEEK DATA — 40 weeks of pregnancy
  // ─────────────────────────────────────────────────────────
  const WEEKS = [
    { 
      week: 1, 
      singleMode: true, 
      singleLabel: 'Pre-pregnancy', 
      size: 'Microscopic', 
      size_mm: 0.1, 
      emoji: '✨', 
      fruitEmoji: '🧂', 
      fruitLabel: 'Sperm & Egg', 
      objectEmoji: '📌', 
      objectLabel: 'Tip of a Needle', 
      baby: "This is the first week of your cycle. Development hasn't started yet, but your follicles are maturing to release a healthy egg.", 
      mom: "Your menstrual period is underway. Estrogen levels are low, and your uterine lining is shedding to prepare for a new, nutrient-rich lining in the coming weeks.", 
      tip: "Start taking a prenatal vitamin containing 400mcg of folic acid daily. Ensure you consult a doctor or healthcare provider to select the right supplement.",
      checklist: ["Purchase high-quality prenatal vitamins with folic acid", "Record the first day of your last menstrual period (LMP)", "Consult your doctor about chronic medications and lifestyle habits"]
    },
    { 
      week: 2, 
      singleMode: true, 
      singleLabel: 'Fertilization', 
      size: 'Microscopic', 
      size_mm: 0.1, 
      emoji: '🥚', 
      fruitEmoji: '🥚', 
      fruitLabel: 'Fertilized Egg', 
      objectEmoji: '🥚', 
      objectLabel: 'Fertilized Egg', 
      baby: "Ovulation typically occurs around day 14. If a sperm fertilizes the egg, cell division begins immediately to form a blastocyst.", 
      mom: "Estrogen levels peak, making uterine lining thicker. You may notice clear, slippery cervical mucus (similar to raw egg whites) indicating peak fertility.", 
      tip: "Timing intercourse around ovulation maximizes conception chances. Avoid smoking, alcohol, and high-mercury fish starting now.",
      checklist: ["Track ovulation symptoms (cervical mucus, temperature rise)", "Time intercourse to align with your peak fertility window", "Maintain a balanced, nutrient-dense diet and stay hydrated"]
    },
    { 
      week: 3, 
      size: 'Microscopic', 
      size_mm: 0.1, 
      emoji: '📌', 
      fruitEmoji: '🧂', 
      fruitLabel: 'Crystal of Salt', 
      objectEmoji: '📌', 
      objectLabel: 'Tip of a Needle', 
      baby: "The fertilized egg (blastocyst) travels down the fallopian tube and implants into the uterine lining, dividing into the embryo and the placenta.", 
      mom: "Implantation might trigger very light spotting or mild cramping (implantation cramping). Your body begins producing hCG hormones.", 
      tip: "Be patient during the two-week wait. Continue taking prenatal vitamins and avoid unnecessary medications unless approved by a doctor.",
      checklist: ["Avoid heavy lifting and intense high-impact workouts", "Continue your daily folic acid or prenatal supplements", "Stay hydrated and prioritize sleeping well to support implantation"]
    },
    { 
      week: 4, 
      size: 'Poppy seed', 
      size_mm: 1.0, 
      emoji: '🌺', 
      fruitEmoji: '🌺', 
      fruitLabel: 'Poppy Seed', 
      objectEmoji: '📌', 
      objectLabel: 'Grain of Sand', 
      baby: "The embryo splits into three layers (ectoderm, mesoderm, and endoderm) which will form organs, skeleton, neural tube, and skin.", 
      mom: "A home pregnancy test should now show a positive result. Hormones may cause breast tenderness, fatigue, bloating, and light nausea.", 
      tip: "Book your first prenatal appointment. Confirm details of your health insurance coverage or maternal health system options.",
      checklist: ["Take a home pregnancy test using first morning urine", "Call your doctor or healthcare provider to schedule your first scan", "Calculate your estimated due date (EDD) based on your LMP"]
    },
    { 
      week: 5, 
      size: 'Appleseed', 
      size_mm: 3.0, 
      emoji: '🌻', 
      fruitEmoji: '🌻', 
      fruitLabel: 'Appleseed', 
      objectEmoji: '⚫', 
      objectLabel: 'BB Pellet', 
      baby: "The neural tube is closing, and the heart is beginning to beat and pump blood. Early blood vessels and limbs are starting to emerge.", 
      mom: "hCG hormone levels are rising quickly. Fatigue, frequent urination, and morning sickness (nausea/vomiting) may start to feel intense.", 
      tip: "Sip ginger tea, eat small meals throughout the day, and drink plenty of water to help manage early nausea.",
      checklist: ["Identify and avoid unpasteurized dairy, raw eggs, and deli meats", "Double check your cosmetics for retinoids or salicylic acid", "Sip ginger tea or chew ginger candies to ease early nausea"]
    },
    { 
      week: 6, 
      size: 'Sweet pea', 
      size_mm: 5.0, 
      emoji: '🫘', 
      fruitEmoji: '🫘', 
      fruitLabel: 'Sweet Pea', 
      objectEmoji: '🟡', 
      objectLabel: 'Pencil Eraser', 
      baby: "Optic vesicles that will form eyes are developing, and tiny arm and leg buds are starting to grow. The jaw and chin are beginning to take shape.", 
      mom: "Hormonal surges can trigger mood swings and extreme fatigue. High blood flow makes breasts feel tender, heavy, and swollen.", 
      tip: "Wear a supportive, wireless bra. If plain water causes nausea, add lemon, cucumber slices, or switch to carbonated water.",
      checklist: ["Keep plain crackers by your bedside to eat before getting up", "Schedule a dental checkup (pregnancy hormones affect gums)", "Wear a comfortable, supportive non-wired cotton bra"]
    },
    { 
      week: 7, 
      size: 'Blueberry', 
      size_mm: 10.0, 
      emoji: '🫐', 
      fruitEmoji: '🫐', 
      fruitLabel: 'Blueberry', 
      objectEmoji: '☕', 
      objectLabel: 'Coffee Bean', 
      baby: "Brain cells are generating rapidly at 250,000 neurons per minute. Tiny nostrils, lenses, and hand plates are beginning to form.", 
      mom: "Your uterus has doubled in size. Increased blood supply and pelvic pressure can lead to frequent trips to the bathroom.", 
      tip: "Listen to your body and rest when tired. Drink at least 8 to 10 cups of water daily to support the amniotic fluid volume.",
      checklist: ["Plan a resting schedule with 8-9 hours of nightly sleep", "Focus on complex carbs like oats and whole wheat to reduce nausea", "Stay hydrated: aim for 2.5 liters of clean water daily"]
    },
    { 
      week: 8, 
      size: 'Raspberry', 
      size_mm: 16.0, 
      emoji: '🍒', 
      fruitEmoji: '🍒', 
      fruitLabel: 'Raspberry', 
      objectEmoji: '📎', 
      objectLabel: 'Paperclip', 
      baby: "Joints like elbows and wrists are forming, and toes are losing their webbing. Tiny muscles start contracting, allowing baby to wiggle.", 
      mom: "You may experience vivid dreams due to hormones and disturbed sleep. Nausea and smell sensitivities might peak around this week.", 
      tip: "Start a pregnancy journal! It’s a great way to track your feelings and milestones during this journey.",
      checklist: ["Note down list of questions for your first prenatal scan", "Start tracking your physical symptoms daily in a logbook", "Learn about safe prenatal core-strengthening exercises"]
    },
    { 
      week: 9, 
      size: 'Green Olive', 
      size_mm: 23.0, 
      emoji: '🟢', 
      fruitEmoji: '🟢', 
      fruitLabel: 'Green Olive', 
      objectEmoji: '🔵', 
      objectLabel: 'Glass Marble', 
      baby: "The heart has divided into four chambers, and toes/fingers are fully separate. The head is large, and eyes remain sealed shut.", 
      mom: "Estrogen and progesterone are high, causing bloating, mild headaches, and occasional mood shifts. Skin might look clearer or break out.", 
      tip: "Schedule your 12-week dating scan if you haven't yet. Focus on gentle walking to boost energy and blood circulation.",
      checklist: ["Book your 12-week prenatal dating and screening scan", "Verify health insurance coverage for scans and labor costs", "Incorporate a 15-minute daily walk into your routine"]
    },
    { 
      week: 10, 
      size: 'Kumquat', 
      size_mm: 31.0, 
      emoji: '🍊', 
      fruitEmoji: '🍊', 
      fruitLabel: 'Kumquat', 
      objectEmoji: '🧱', 
      objectLabel: 'Lego Brick (2x2)', 
      baby: "Critical development is done. Baby is now a fetus and will focus on growing rapidly. Essential organs are formed, and tiny fingernails and bones are hardening.", 
      mom: "You may feel round ligament pain (sharp twinges in the lower abdomen) as your uterine support muscles stretch.", 
      tip: "Discuss NIPT (Non-Invasive Prenatal Testing) with your doctor. It's a simple blood test to check baby's health.",
      checklist: ["Consult your doctor or healthcare provider about NIPT options", "Practice pelvic tilts to help ease round ligament pains", "Invest in a gentle, pregnancy-safe belly moisturizer"]
    },
    { 
      week: 11, 
      size: 'Fig', 
      size_mm: 41.0, 
      emoji: '🟣', 
      fruitEmoji: '🟣', 
      fruitLabel: 'Fig', 
      objectEmoji: '🟤', 
      objectLabel: 'Poker chip', 
      baby: "The baby can open and close hands, hiccup, and do somersaults. Hair follicles are forming on the scalp.", 
      mom: "Your blood volume has increased, which might make you feel warmer than usual. Hair and nails may grow thicker and faster.", 
      tip: "Your skin is stretching. Use a rich moisturizer on your belly to help with dryness and itching.",
      checklist: ["Moisturize your belly, hips, and breasts after showering", "Eat calcium-rich foods like yogurt, almonds, and leafy greens", "Wear breathable cotton fabrics to manage feeling warm"]
    },
    { 
      week: 12, 
      size: 'Passion Fruit', 
      size_mm: 54.0, 
      emoji: '🍑', 
      fruitEmoji: '🍑', 
      fruitLabel: 'Passion Fruit', 
      objectEmoji: '🔋', 
      objectLabel: 'AA battery', 
      baby: "The kidneys are functioning, producing urine that contributes to amniotic fluid. Reflexes are developing rapidly, and baby can open and close fingers.", 
      mom: "Good news! The placenta is taking over hormone production, so morning sickness and extreme fatigue should start to ease up.", 
      tip: "12-week scan week! This is a major milestone where you get to see your baby's profile clearly.",
      checklist: ["Attend your 12-week dating scan and collect the ultrasound photos", "Start budgeting for baby essentials and nursery setup", "Prepare your announcement plan for family and friends (if ready)"]
    },
    { 
      week: 13, 
      size: 'Peach', 
      size_mm: 70.0, 
      emoji: '🍑', 
      fruitEmoji: '🍑', 
      fruitLabel: 'Peach', 
      objectEmoji: '🎾', 
      objectLabel: 'Tennis Ball', 
      baby: "Welcome to the second trimester! Fingerprints are forming. Bones begin hardening. Baby can make facial expressions — frowns and squints are visible on scan.", 
      mom: "Most women feel dramatically better from week 13. Energy returns, nausea fades, and the so-called 'pregnancy glow' often appears.", 
      tip: "The second trimester is ideal for exercise — prenatal yoga, swimming, and walking are all excellent choices.",
      checklist: ["Begin doing pelvic floor (Kegel) exercises daily", "Browse maternity clothing options as your waistline expands", "Research safe travel guidelines for a second-trimester babymoon"]
    },
    { 
      week: 14, 
      size: 'Lemon', 
      size_mm: 85.0, 
      emoji: '🍋', 
      fruitEmoji: '🍋', 
      fruitLabel: 'Lemon', 
      objectEmoji: '🖱️', 
      objectLabel: 'Computer Mouse', 
      baby: "Baby makes sucking movements. Fine hair called lanugo covers the body for warmth. The liver produces bile; the spleen produces red blood cells.", 
      mom: "Round ligament pains may continue as your belly grows. Appetite often increases. Constipation and heartburn can begin now.", 
      tip: "A pregnancy pillow can dramatically improve sleep quality. Invest in one now before you really need it in the third trimester.",
      checklist: ["Purchase a supportive U-shaped or C-shaped pregnancy pillow", "Eat high-fiber foods (beans, pears, oats) to prevent constipation", "Do 20-30 minutes of low-impact prenatal exercise (swimming, yoga)"]
    },
    { 
      week: 15, 
      size: 'Apple', 
      size_mm: 100.0, 
      emoji: '🍎', 
      fruitEmoji: '🍎', 
      fruitLabel: 'Apple', 
      objectEmoji: '⚾', 
      objectLabel: 'Baseball', 
      baby: "Taste buds form. Ears reach their final position — baby can now hear sounds from outside the womb. The skeleton is changing from cartilage to bone.", 
      mom: "You may feel the first faint flutters of baby movement — often described as butterflies or gas bubbles. Nosebleeds and gum sensitivity are common.", 
      tip: "Start talking and singing to your bump — baby can hear you now, and it supports early bonding.",
      checklist: ["Practice side-sleeping on your left side using pillows", "Schedule a routine dental checkup for bleeding gums", "Take time to talk, read, or sing to your baby daily"]
    },
    { 
      week: 16, 
      size: 'Avocado', 
      size_mm: 115.0, 
      emoji: '🥑', 
      fruitEmoji: '🥑', 
      fruitLabel: 'Avocado', 
      objectEmoji: '📱', 
      objectLabel: 'Smartphone', 
      size_in: 'Raw keri (green mango)', 
      baby: "Baby holds its head up. Eyes can sense light. Baby constantly moves, swallows amniotic fluid, and practises breathing movements.", 
      mom: "Your bump is clearly visible. Your 16-week routine screening check includes blood pressure and urine test.", 
      tip: "Now is a great time to buy maternity clothes. Your bump will grow rapidly from here and regular clothes will become very uncomfortable.",
      checklist: ["Attend your 16-week routine prenatal checkup", "Research local antenatal and childbirthing classes", "Verify that all cleaning supplies used at home are pregnancy-safe"]
    },
    { 
      week: 17, 
      size: 'Pear', 
      size_mm: 130.0, 
      emoji: '🍐', 
      fruitEmoji: '🍐', 
      fruitLabel: 'Pear', 
      objectEmoji: '💿', 
      objectLabel: 'Compact Disc', 
      baby: "Fat begins accumulating under baby's skin for insulation and energy. The umbilical cord thickens and strengthens. Heartbeat is about 140–150 bpm.", 
      mom: "Baby movements should be more clearly felt this week. Your centre of gravity is shifting — you may feel slightly off-balance.", 
      tip: "Pelvic floor exercises daily from now on — they prevent incontinence and significantly aid recovery after birth.",
      checklist: ["Perform daily pelvic tilts to help ease lower back strain", "Invest in comfortable flat shoes with good arch support", "Drink extra fluids if you experience round ligament stretch pain"]
    },
    { 
      week: 18, 
      size: 'Bell pepper', 
      size_mm: 140.0, 
      emoji: '🫑', 
      fruitEmoji: '🫑', 
      fruitLabel: 'Bell pepper', 
      objectEmoji: '📺', 
      objectLabel: 'TV Remote', 
      baby: "Baby is about 14cm. The nervous system develops rapidly. Baby yawns, stretches, and makes sucking motions. A covering called myelin begins insulating nerve fibres.", 
      mom: "Your 20-week anomaly scan is typically booked now. Start thinking about your birth preferences and researching options.", 
      tip: "Research maternity leave and benefits in your country now — the paperwork deadlines often come around earlier than you expect.",
      checklist: ["Confirm the date and time of your 20-week anomaly scan", "Avoid lying flat on your back; use a pillow block behind you", "Review maternity leave options and workplace notice periods"]
    },
    { 
      week: 19, 
      size: 'Mango', 
      size_mm: 150.0, 
      emoji: '🥭', 
      fruitEmoji: '🥭', 
      fruitLabel: 'Mango', 
      objectEmoji: '📟', 
      objectLabel: 'Small Calculator', 
      size_in: 'Alphonso mango', 
      baby: "Vernix caseosa — a creamy white coating — forms on baby's skin to protect it. Sensory development accelerates: touch, taste, smell, sight, and hearing all advancing.", 
      mom: "Movements are stronger and more regular. Backache and sciatic nerve pain may start as posture changes under the weight of your bump.", 
      tip: "A physiotherapist or prenatal massage therapist can help with pelvic girdle pain and backache — don't just endure it.",
      checklist: ["Do gentle calf stretches before going to bed", "Add magnesium-rich foods (spinach, pumpkin seeds) to meals", "Check that your daily vitamins include vitamin D3"]
    },
    { 
      week: 20, 
      size: 'Banana', 
      size_mm: 160.0, 
      emoji: '🍌', 
      fruitEmoji: '🍌', 
      fruitLabel: 'Banana', 
      objectEmoji: '📱', 
      objectLabel: 'Tablet', 
      baby: "Halfway there! Baby is now measured head to toe — about 25cm. In girls, the uterus has formed; in boys, the testes are descending. Baby can hear music.", 
      mom: "The anomaly scan this week checks all major organs in detail. This is one of the most exciting appointments of pregnancy.", 
      tip: "Start a baby registry now — you have time to research properly and won't be overwhelmed with a newborn yet.",
      checklist: ["Attend your 20-week anomaly scan and review the results", "Begin drafting a baby registry list for nursery essentials", "Wear moisturizing belly cream to ease skin tightness"]
    },
    { 
      week: 21, 
      size: 'Corn on the Cob', 
      size_mm: 265.0, 
      emoji: '🌽', 
      fruitEmoji: '🌽', 
      fruitLabel: 'Corn on the Cob', 
      objectEmoji: '📖', 
      objectLabel: 'Hardcover Book', 
      baby: "Movements form a recognisable pattern — you'll start to learn your baby's active times. Rapid eye movements occur during sleep. Fingernails are fully formed.", 
      mom: "Heartburn and indigestion may intensify as the uterus pushes against your stomach. Sleeping with your head elevated helps.", 
      tip: "Shop for a maternity bra — your cup size will change significantly during pregnancy and nursing.",
      checklist: ["Eat 5-6 small meals instead of 3 large meals to ease reflux", "Shop for nursing bras (your bust size will continue to adjust)", "Ensure you get enough iron through diet or supplements"]
    },
    { 
      week: 22, 
      size: 'Papaya', 
      size_mm: 275.0, 
      emoji: '🍈', 
      fruitEmoji: '🍈', 
      fruitLabel: 'Papaya', 
      objectEmoji: '📏', 
      objectLabel: 'Ruler (30cm)', 
      baby: "Baby weighs about 430g. Eyebrows and eyelashes have appeared. The sense of hearing is well developed — baby recognises your voice.", 
      mom: "Braxton Hicks contractions (practice contractions) may begin — irregular, painless tightening. Ankle swelling can start.", 
      tip: "Elevate your feet when sitting and stay well hydrated to reduce ankle swelling, which is very common from now on.",
      checklist: ["Elevate your feet on a footstool when sitting down", "Drink at least 2.5 to 3 liters of water to manage swelling", "Read about different labor pain relief methods (epidural, gas)"]
    },
    { 
      week: 23, 
      size: 'Grapefruit', 
      size_mm: 285.0, 
      emoji: '🍊', 
      fruitEmoji: '🍊', 
      fruitLabel: 'Grapefruit', 
      objectEmoji: '🤧', 
      objectLabel: 'Box of Tissues', 
      baby: "Baby has a real sleeping and waking cycle. The face is fully formed. Skin is still red and somewhat transparent as fat continues to accumulate underneath.", 
      mom: "Your uterus is now above your belly button. Weight gain of 5–8kg by now is typical. Stretch marks may begin appearing.", 
      tip: "Stretch mark creams applied twice daily can help — though genetics play a large role too.",
      checklist: ["Moisturize your belly and hips twice daily", "Verify your glucose test scheduling for gestational diabetes", "Practice slow, calm breathing exercises daily"]
    },
    { 
      week: 24, 
      size: 'Papaya', 
      size_mm: 295.0, 
      emoji: '🍈', 
      fruitEmoji: '🍈', 
      fruitLabel: 'Papaya', 
      objectEmoji: '📖', 
      objectLabel: 'School Dictionary', 
      baby: "Baby reaches viability — a critical milestone. Born at 24 weeks, a baby has a chance of survival with intensive care. Lungs produce surfactant to work after birth.", 
      mom: "Glucose tolerance test screens for gestational diabetes. Tiredness and more frequent Braxton Hicks contractions are common.", 
      tip: "Know the signs of preterm labour: regular contractions, lower back pain, pelvic pressure, or unusual discharge. Call your doctor or healthcare provider if concerned.",
      checklist: ["Complete your gestational diabetes glucose tolerance test", "Learn the signs of preterm labor (cramps, persistent backache)", "Finalize baby nursery safety inspections and setup"]
    },
    { 
      week: 25, 
      size: 'Cauliflower', 
      size_mm: 340.0, 
      emoji: '🥦', 
      fruitEmoji: '🥦', 
      fruitLabel: 'Cauliflower', 
      objectEmoji: '👟', 
      objectLabel: 'Shoebox', 
      baby: "Baby responds to touch and sound consistently. Hair shows pigmentation. Hands are fully formed with well-developed fingerprints unique to your baby.", 
      mom: "You may feel baby hiccuping — a rhythmic pulsing sensation. Carpal tunnel syndrome (wrist tingling) is common in pregnancy.", 
      tip: "Write your birth plan now while you have time to research and discuss it calmly with your doctor or healthcare provider.",
      checklist: ["Perform gentle hip opening stretches or prenatal yoga", "Discuss your birth preferences and plans with your partner", "Wear supportive wrist splints at night if tingling occurs"]
    },
    { 
      week: 26, 
      size: 'Lettuce head', 
      size_mm: 355.0, 
      emoji: '🥬', 
      fruitEmoji: '🥬', 
      fruitLabel: 'Lettuce head', 
      objectEmoji: '⌨️', 
      objectLabel: 'Keyboard', 
      size_in: 'Palak bunch (spinach)', 
      baby: "Baby's eyes open for the first time. Brainwave activity begins — your baby may dream! The immune system is developing as antibodies transfer from you to baby.", 
      mom: "The third trimester begins next week. Lower back pain and pelvic girdle pain can become more noticeable. Keep stretching and moving.", 
      tip: "Book antenatal classes now — they fill up fast. Check for online or local hospital options.",
      checklist: ["Enroll in antenatal, labor, and newborn care classes", "Confirm that your hospital bag packing list is drafted", "Limit late-afternoon caffeine to help with insomnia"]
    },
    { 
      week: 27, 
      size: 'Cauliflower', 
      size_mm: 370.0, 
      emoji: '🥦', 
      fruitEmoji: '🥦', 
      fruitLabel: 'Cauliflower', 
      objectEmoji: '🍼', 
      objectLabel: '2-Litre Bottle', 
      baby: "Welcome to the third trimester! Baby weighs about 900g. Lungs are maturing but still need more time. Baby practises breathing by inhaling amniotic fluid.", 
      mom: "Sleep becomes more challenging. A U-shaped pregnancy pillow will transform your sleep quality. Heartburn, leg cramps, and frequent urination intensify.", 
      tip: "A good pregnancy pillow is the single best purchase for the third trimester. Invest in one this week — your sleep will thank you.",
      checklist: ["Position a supportive pillow between your knees when sleeping", "Wash early baby clothes in gentle, non-bio detergent", "Practice diaphragmatic breathing to ease breathlessness"]
    },
    { 
      week: 28, 
      size: 'Large aubergine', 
      size_mm: 375.0, 
      emoji: '🍆', 
      fruitEmoji: '🍆', 
      fruitLabel: 'Large aubergine', 
      objectEmoji: '🎳', 
      objectLabel: 'Bowling Pin', 
      baby: "Baby weighs about 1kg. Eyes are fully open and can detect light. The brain grows rapidly, developing the characteristic folds that increase surface area.", 
      mom: "Your 28-week blood tests check for anaemia. You may start anti-D injections if you're Rh negative. Fetal movements should be monitored daily.", 
      tip: "Count fetal movements daily from now — 10 movements in 2 hours is reassuring. Call your doctor or healthcare provider if movements reduce significantly.",
      checklist: ["Attend your 28-week routine screening and blood tests", "Perform a kick counting session daily at the same time", "Check your Rh negative status and discuss anti-D if needed"]
    },
    { 
      week: 29, 
      size: 'Butternut squash', 
      size_mm: 385.0, 
      emoji: '🥒', 
      fruitEmoji: '🥒', 
      fruitLabel: 'Butternut squash', 
      objectEmoji: '⛑️', 
      objectLabel: 'Motorcycle Helmet', 
      size_in: 'Lauki (bottle gourd)', 
      baby: "Baby weighs about 1.2kg. Muscles and lungs continue maturing. Fat accumulates rapidly. Baby's skin is less wrinkled as fat fills it out.", 
      mom: "Shortness of breath increases as your uterus pushes against your diaphragm. Sleep on your left side to improve circulation.", 
      tip: "Pack your hospital bag now — babies can arrive early. Include items for labour, delivery, and the postnatal ward.",
      checklist: ["Pack your hospital bag with clothing and toiletries", "Avoid sitting cross-legged to optimize pelvic blood flow", "Practice labor wiggling and breathing styles weekly"]
    },
    { 
      week: 30, 
      size: 'Cabbage', 
      size_mm: 395.0, 
      emoji: '🟢', 
      fruitEmoji: '🟢', 
      fruitLabel: 'Cabbage', 
      objectEmoji: '🎳', 
      objectLabel: 'Bowling Ball', 
      baby: "Baby can now regulate body temperature. Brain surface wrinkles are forming rapidly. The fine body hair (lanugo) begins to disappear.", 
      mom: "You may feel breathless and very tired. Pelvic pressure increases. Baby's kicks and rolls are reassuring signs of good health.", 
      tip: "Research infant CPR and first aid for babies — a short course before birth gives you confidence from day one.",
      checklist: ["Book a pediatric first aid or baby CPR course", "Spend 15-20 minutes daily sitting on a birth ball", "Verify that your partner knows their role during labor"]
    },
    { 
      week: 31, 
      size: 'Coconut', 
      size_mm: 405.0, 
      emoji: '🥥', 
      fruitEmoji: '🥥', 
      fruitLabel: 'Coconut', 
      objectEmoji: '🖥️', 
      objectLabel: 'Monitor Base', 
      baby: "Baby can turn its head. Five senses are almost fully developed. Brain growth is accelerating. Baby's pupils react to light now.", 
      mom: "Braxton Hicks contractions are more frequent. Sleep is disrupted by discomfort, movements, and toilet trips. Rest whenever you can.", 
      tip: "Arrange a tour of your hospital's maternity unit — being familiar with the space reduces anxiety during labour.",
      checklist: ["Tour your selected hospital or birthing center facility", "Verify all items on your nursery furniture checklist", "Prepare a postpartum recovery kit for yourself"]
    },
    { 
      week: 32, 
      size: 'Butternut Squash', 
      size_mm: 420.0, 
      emoji: '🍈', 
      fruitEmoji: '🍈', 
      fruitLabel: 'Butternut Squash', 
      objectEmoji: '🧰', 
      objectLabel: '17-inch Tool Box', 
      baby: "Baby weighs about 1.8kg. Survival rate if born now is over 95% with good neonatal care. Baby often moves into the head-down position this week.", 
      mom: "You're gaining about 500g per week now. Swelling of feet and ankles is common. Report sudden severe swelling to your doctor or healthcare provider immediately.", 
      tip: "Discuss pain relief options thoroughly with your doctor or healthcare provider — understand epidurals, gas and air, TENS machines, and water birth.",
      checklist: ["Discuss pain relief preferences with your OB-GYN or doctor", "Walk 15-20 minutes daily to keep joints moving", "Report any sudden face or hand swelling to your doctor"]
    },
    { 
      week: 33, 
      size: 'Pineapple', 
      size_mm: 430.0, 
      emoji: '🍍', 
      fruitEmoji: '🍍', 
      fruitLabel: 'Pineapple', 
      objectEmoji: '🛹', 
      objectLabel: 'Skateboard', 
      baby: "Baby's skull is hardening but remains soft enough to compress for birth. The immune system strengthens. Baby practises sucking and swallowing continuously.", 
      mom: "Pelvic pressure intensifies as baby engages. You may notice colostrum (first milk) leaking from your nipples — this is completely normal.", 
      tip: "Buy nursing pads now — you'll need them postpartum whether or not you plan to breastfeed, as colostrum may leak.",
      checklist: ["Purchase nursing breast pads and nursing bras", "Install the baby car seat and verify it is secure", "Sterilize baby bottles and breast pump parts (if using)"]
    },
    { 
      week: 34, 
      size: 'Cantaloupe', 
      size_mm: 450.0, 
      emoji: '🥝', 
      fruitEmoji: '🥝', 
      fruitLabel: 'Cantaloupe', 
      objectEmoji: '🏋️', 
      objectLabel: 'Dumbbell (5 lb)', 
      size_in: 'Kharbooja (musk melon)', 
      baby: "Baby's nails reach the fingertips. The central nervous system and lungs are almost fully mature. Baby is usually in a head-down position by now.", 
      mom: "Your doctor or healthcare provider will check baby's position at your 34-week appointment. Heartburn, backache, and tiredness are very common now.", 
      tip: "Freeze meals for the first weeks after birth now while you have the energy — cooking with a newborn is extremely difficult.",
      checklist: ["Prepare and freeze 4-5 meals for postpartum weeks", "Pack baby's hospital outfits and receiving blankets", "Confirm the list of pediatricians in your local area"]
    },
    { 
      week: 35, 
      size: 'Honeydew melon', 
      size_mm: 460.0, 
      emoji: '🍏', 
      fruitEmoji: '🍏', 
      fruitLabel: 'Honeydew melon', 
      objectEmoji: '💻', 
      objectLabel: 'Laptop (15 inch)', 
      size_in: 'Kharbooja (musk melon)', 
      baby: "Baby weighs about 2.4kg. Most development is complete — the next weeks are mainly about weight gain and final lung maturation.", 
      mom: "Monitor movements carefully — they should remain regular. Contact your doctor or healthcare provider if you notice a significant reduction in movement.", 
      tip: "Prepare your postpartum recovery kit: maternity pads, comfortable underwear, pain relief, witch hazel, and hospital-bag snacks.",
      checklist: ["Double check your postpartum pads and underwear supply", "Sanitize all breast pump shields and parts", "Keep count of baby's rolls and movements daily"]
    },
    { 
      week: 36, 
      size: 'Romaine lettuce', 
      size_mm: 470.0, 
      emoji: '🌿', 
      fruitEmoji: '🌿', 
      fruitLabel: 'Romaine lettuce', 
      objectEmoji: '🛌', 
      objectLabel: 'Standard Pillow', 
      size_in: 'Bunch of palak leaves', 
      baby: "Baby weighs about 2.7kg and gains 28g per day. Cheeks are chubby from fat deposits. Sucking muscles are strong and ready for feeding.", 
      mom: "Baby may 'drop' (engage into the pelvis) this week — you'll breathe more easily but feel more pelvic pressure and urgency to urinate.", 
      tip: "Register on your hospital's patient portal now and download any maternity apps they recommend for monitoring movements.",
      checklist: ["Attend your 36-week prenatal checkup and GBS test", "Confirm hospital portal registration is fully completed", "Practice breathing coach exercises with the timer"]
    },
    { 
      week: 37, 
      size: 'Bunch of greens', 
      size_mm: 480.0, 
      emoji: '🌱', 
      fruitEmoji: '🌱', 
      fruitLabel: 'Bunch of greens', 
      objectEmoji: '🎒', 
      objectLabel: 'School Backpack', 
      size_in: 'Bunch of methi (fenugreek)', 
      baby: "Baby is early term. Lungs are mature. Baby practises all skills for birth: sucking, swallowing, gripping, and breathing movements.", 
      mom: "You may notice the mucus plug passing ('bloody show') — a sign labour is approaching in the coming days or weeks.", 
      tip: "Know the difference between Braxton Hicks and real labour: real contractions become longer, stronger, and closer together over time.",
      checklist: ["Pack labor snacks (honey, dry fruits, energy drinks)", "Ensure the car has a full tank of fuel for the hospital", "Verify the hospital parking area and labor ward entrance"]
    },
    { 
      week: 38, 
      size: 'Leek', 
      size_mm: 490.0, 
      emoji: '🪴', 
      fruitEmoji: '🪴', 
      fruitLabel: 'Leek', 
      objectEmoji: '🖥️', 
      objectLabel: 'Desktop PC Tower', 
      baby: "Baby is full term. All organs function. Baby continues gaining fat. Vernix and lanugo shed and are swallowed into the amniotic fluid.", 
      mom: "The nesting instinct often kicks in strongly. Irregular contractions and backache may signal that labour is not far away.", 
      tip: "Double-check your hospital bag is packed. Make sure your birth partner knows the route, where to park, and which entrance to use.",
      checklist: ["Practice pelvic floor wiggles to ease hip pressure", "Perform daily kick counts and write them down", "Verify birth partner emergency contact list is ready"]
    },
    { 
      week: 39, 
      size: 'Mini watermelon', 
      size_mm: 500.0, 
      emoji: '🍉', 
      fruitEmoji: '🍉', 
      fruitLabel: 'Mini watermelon', 
      objectEmoji: '🍞', 
      objectLabel: 'Toaster', 
      baby: "Baby is 50cm and weighs about 3.3kg. The brain and lungs benefit enormously from every extra day inside the womb at this stage.", 
      mom: "You may feel every day is the day! Watch for: contractions 5 minutes apart for 1 hour, waters breaking, or strong bloody show.", 
      tip: "Prepare mentally for birth — hypnobirthing, breathing techniques, and visualisation are all clinically evidenced to help manage labour.",
      checklist: ["Review the hospital labor protocol and 5-1-1 rule", "Prepare your home for returning (clean sheets, bassinet ready)", "Keep water and labor breathing playlist ready"]
    },
    { 
      week: 40, 
      size: 'Small pumpkin', 
      size_mm: 510.0, 
      emoji: '🌕', 
      fruitEmoji: '🌕', 
      fruitLabel: 'Small pumpkin', 
      objectEmoji: '🏀', 
      objectLabel: 'Basketball', 
      size_in: 'Kaddu (Indian pumpkin)', 
      baby: "This is your due date week! Baby is around 51cm and 3.4kg on average. Only about 5% of babies are born on their exact due date.", 
      mom: "If labour hasn't started, your doctor or healthcare provider will discuss membrane sweep or induction. Most babies arrive within 2 weeks of their due date.", 
      tip: "Rest. Trust your body. You are ready. However labour starts — you've got this.",
      checklist: ["Perform daily kick counts and stay active with walking", "Verify diaper changing station is fully stocked", "Schedule your 41-week sweep or checkup appointment"]
    },
    { 
      week: 41, 
      size: 'Pumpkin', 
      size_mm: 515.0, 
      emoji: '🎃', 
      fruitEmoji: '🎃', 
      fruitLabel: 'Pumpkin', 
      objectEmoji: '⏲️', 
      objectLabel: 'Microwave', 
      baby: "Baby continues to grow. Placental function is monitored closely. Baby is considered overdue (post-term) this week.", 
      mom: "Induction is typically offered between 41 and 42 weeks. CTG monitoring checks baby's heart rate and movements regularly.", 
      tip: "Induction is a safe, well-evidenced option. Discuss it with your doctor or healthcare provider — it significantly reduces risk beyond 42 weeks.",
      checklist: ["Attend CTG monitoring sessions at the hospital", "Discuss medical induction scheduling options with your doctor", "Prioritize hydration and rest as delivery approaches"]
    },
    { 
      week: 42, 
      size: 'Large pumpkin', 
      size_mm: 520.0, 
      emoji: '🎃', 
      fruitEmoji: '🎃', 
      fruitLabel: 'Large pumpkin', 
      objectEmoji: '🧳', 
      objectLabel: 'Carry-on Suitcase', 
      baby: "At 42 weeks most hospitals strongly recommend induction. Placental function naturally decreases after 42 weeks, so timing is important.", 
      mom: "You are post-term. Induction should be arranged. Amniotic fluid levels and placental function are closely monitored.", 
      tip: "Discuss all options with your doctor or healthcare provider. You are so close to meeting your baby — and they will be here very soon.",
      checklist: ["Arrange hospital arrival for scheduled induction", "Confirm all birth bag items are in the car trunk", "Stay calm, practice slow breathing, you are ready!"]
    }
  ];

  // ─────────────────────────────────────────────────────────
  //  AMAZON ASSOCIATES — LOCALE DETECTION
  //  India (.in):  tag = pregnancyweek-21
  //  Global (.com): tag = pregnancywe08-20
  // ─────────────────────────────────────────────────────────
  var AMAZON_LOCALES = {
    'en-IN': { domain: 'amazon.in',  tag: 'pregnancyweek-21' },
    'hi':    { domain: 'amazon.in',  tag: 'pregnancyweek-21' },
    'hi-IN': { domain: 'amazon.in',  tag: 'pregnancyweek-21' },
    'en-GB': { domain: 'amazon.co.uk', tag: 'pregnancywe08-20' },
    'en-AU': { domain: 'amazon.com.au', tag: 'pregnancywe08-20' },
    'en-CA': { domain: 'amazon.ca',  tag: 'pregnancywe08-20' },
    'default': { domain: 'amazon.com', tag: 'pregnancywe08-20' }
};

  function getAmazonLocale() {
    var lang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    // Check Indian locales first (highest priority for this site)
    if (lang === 'en-in' || lang === 'hi' || lang === 'hi-in' || lang.startsWith('hi')) {
      return AMAZON_LOCALES['en-IN'];
  }
    // Check timezone as fallback for India
    try {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if (tz.startsWith('Asia/Kolkata') || tz.startsWith('Asia/Calcutta')) {
        return AMAZON_LOCALES['en-IN'];
    }
  } catch(e) {}
    // UK visitors
    if (lang === 'en-gb') return AMAZON_LOCALES['en-GB'];
    // Australia
    if (lang === 'en-au') return AMAZON_LOCALES['en-AU'];
    // Canada
    if (lang === 'en-ca') return AMAZON_LOCALES['en-CA'];
    // Everyone else → amazon.com
    return AMAZON_LOCALES['default'];
}

  var USER_LOCALE = getAmazonLocale();

  function amzLink(keyword) {
    return 'https://www.' + USER_LOCALE.domain + '/s?k=' + encodeURIComponent(keyword) + '&tag=' + USER_LOCALE.tag;
}

  function smoothScrollTo(element) {
    if (!element) return;
    setTimeout(function() {
      try {
        var navbarHeight = 84; 
        var rect = element.getBoundingClientRect();
        var scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
        var targetY = rect.top + scrollTop - navbarHeight;
        if ('scrollBehavior' in document.documentElement.style) {
          window.scrollTo({
            top: Math.max(0, targetY),
            behavior: 'smooth'
          });
        } else {
          window.scrollTo(0, Math.max(0, targetY));
        }
      } catch(e) {
        try {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch(e2) {
          try { element.scrollIntoView(); } catch(e3) {}
        }
      }
    }, 150);
  }

  // ─────────────────────────────────────────────────────────
  //  PRODUCT RECOMMENDATIONS BY TRIMESTER
  //  Links auto-switch between amazon.in / .com / .co.uk / .ca / .com.au
  // ─────────────────────────────────────────────────────────
  var PRODUCTS = {
    t1: [
      { icon: '💊', name: 'Prenatal Vitamins', why: 'Folic acid + iron + DHA for early development', keyword: 'prenatal vitamins' },
      { icon: '🌊', name: 'Sea-Band Wristbands', why: 'Drug-free acupressure relief for morning sickness', keyword: 'sea band pregnancy' },
      { icon: '🍪', name: 'Morning Sickness Crackers', why: 'Plain, easy-to-digest crackers for nausea and low appetite', keyword: 'saltine crackers' },
      { icon: '📖', name: '"What to Expect When You\'re Expecting"', why: 'The most trusted pregnancy guide — covers every week', keyword: 'what to expect when expecting' },
      { icon: '🫚', name: 'Pregnancy-Safe Body Oil', why: 'Start early to moisturise skin as it begins to stretch', keyword: 'bio oil pregnancy' }
    ],
    t2: [
      { icon: '🛏️', name: 'U-Shaped Pregnancy Pillow', why: 'The most impactful purchase for sleep comfort in pregnancy', keyword: 'pregnancy pillow u shaped' },
      { icon: '👗', name: 'Maternity Leggings \x26 Tops', why: 'Comfortable, bump-accommodating staples for everyday wear', keyword: 'maternity clothes' },
      { icon: '🧴', name: 'Stretch Mark Cream', why: 'Shea butter and vitamin E to support skin elasticity', keyword: 'stretch mark cream pregnancy' },
      { icon: '👶', name: 'Baby Names Book', why: 'Start the name conversation early — it takes longer than you think!', keyword: 'baby names book' }
    ],
    t3: [
      { icon: '🎒', name: 'Hospital Bag Kit', why: 'Everything you need for labour, delivery, and the postnatal ward', keyword: 'hospital bag pregnancy kit' },
      { icon: '📹', name: 'Baby Monitor (Video)', why: 'Peace of mind from day one — video + audio + breathing sensor', keyword: 'baby monitor video' },
      { icon: '🤱', name: 'Nursing Bra Set (3-pack)', why: 'Essential for postpartum — whether breastfeeding or not', keyword: 'nursing bra set' },
      { icon: '🍼', name: 'Muslin Swaddle Blankets', why: 'Swaddling calms newborns — you will go through 6+ per day', keyword: 'muslin swaddle blankets' }
    ]
};

  // ─────────────────────────────────────────────────────────
  //  FAQ DATA
  // ─────────────────────────────────────────────────────────
  const FAQS = [
    { q: 'How is my pregnancy due date calculated?', a: 'Your estimated due date (EDD) is calculated as 280 days (40 weeks) from the first day of your last menstrual period (LMP). This is called Naegele\'s rule. The calculation assumes a 28-day cycle — if your cycle is longer or shorter, your actual due date may differ slightly. Your 12-week dating scan gives a more accurate estimate based on baby\'s actual measurements.' },
    { q: 'Why does pregnancy start from the last period, not conception?', a: 'Doctors and obstetricians count pregnancy from the LMP because it\'s a known, consistent date — the exact moment of ovulation and conception varies and can\'t be pinpointed. So when your period is one week late, you\'re technically already 5 weeks pregnant (2 weeks before ovulation + 3 weeks since). It\'s a convention, not biology.' },
    { q: 'How accurate is this due date calculator?', a: 'This calculator uses the standard obstetric formula (Naegele\'s rule). However, due dates are estimates — only about 5% of babies arrive on their exact due date. Most are born within 2 weeks before or after. Your 12-week dating scan, which measures your baby\'s crown-rump length, gives a more accurate estimate and supersedes the LMP calculation if there\'s a significant difference.' },
    { q: 'What is the 5-1-1 rule for contractions?', a: 'The 5-1-1 rule is a standard guideline for when to head to the hospital. It means: your contractions are <strong>5 minutes apart</strong> (measured from the start of one to the start of the next), each one lasts for <strong>1 full minute</strong>, and this pattern has been consistent for <strong>1 full hour</strong>. Always call your doctor, healthcare provider, or hospital before leaving to confirm they are ready for you.' },
    { q: 'How should I use the Baby Kick Counter?', a: 'Standard medical advice is to start counting kicks daily from 28 weeks. Find a time when your baby is usually active (often after a meal or in the evening). You should aim to feel 10 movements (kicks, flutters, swishes, or rolls) within 2 hours. If you don\'t reach 10 in 2 hours, or if you notice a significant decrease in your baby\'s normal movement pattern, contact your maternity unit or doctor immediately.' },
    { q: 'Are the size comparison photos real?', a: 'Yes! We use custom-shot scale reference photos that show common fruits and vegetables in a real human hand. This gives you a much more accurate sense of your baby\'s actual size and volume compared to generic stock photos or icons used in other apps.' },
    { q: 'When will I feel my baby move for the first time?', a: 'First movements (called quickening) are typically felt between weeks 16 and 20. First-time mothers often feel them later (around week 20) as they may not recognise the sensation at first. Women who have been pregnant before often recognise the flutter-like movements sooner. From around week 28, your doctor or healthcare provider will ask you to monitor movements daily.' },
    { q: 'Is this tool safe to use? Does it store my data?', a: 'All calculations happen entirely in your browser — no data is sent to any server. We do not store your dates, results, or any personal information. This tool respects your privacy completely. The URL sharing feature only works if you choose to copy and share it; we do not record who visits or what dates they enter.' }
  ];

  // ─────────────────────────────────────────────────────────
  //  STATE & ANALYTICS
  // ─────────────────────────────────────────────────────────
  function trackEvent(eventName, params) {
    if (typeof gtag === 'function') {
      gtag('event', eventName, params || {});
    }
  }

  var currentMode = 'lmp';
  var currentResult = null;
  var currentImageTab = 'fruit';

  // ─────────────────────────────────────────────────────────
  //  INIT
  // ─────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function() {
    // Set max date for LMP input to today
    var today = new Date();
    var maxLMP = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000); // at least 1 week ago
    var lmpDateEl = document.getElementById('lmpDate');
    var dueDateEl = document.getElementById('dueDate');
    if (lmpDateEl) {
      lmpDateEl.max = formatDateInput(today);
    }
    if (dueDateEl) {
      dueDateEl.min = formatDateInput(new Date(today.getTime() - 28 * 24 * 60 * 60 * 1000));
      dueDateEl.max = formatDateInput(new Date(today.getTime() + 308 * 24 * 60 * 60 * 1000));
    }

    // Wait for Wikipedia images to load, then render timeline with real photos
    loadWeekImages().then(function() {
      renderWeeksTimeline(null);
  });
    // Also render immediately with fallback emojis (will be replaced once images load)
    renderWeeksTimeline(null);
    renderFAQ();

    // Load from URL query params if present
    var params = new URLSearchParams(window.location.search);
    var lmpParam = params.get('lmp');
    if (lmpParam) {
      if (document.getElementById('lmpDate')) {
        document.getElementById('lmpDate').value = lmpParam;
        calculate();
      }
    } else {
      // Load from localStorage if returning user
      var savedMode = localStorage.getItem('pwtSavedMode');
      if (savedMode) {
        if (savedMode === 'lmp') {
          var sLMP = localStorage.getItem('pwtSavedLMP');
          var sCy = localStorage.getItem('pwtSavedCycle');
          if (sLMP && document.getElementById('lmpDate')) {
            document.getElementById('lmpDate').value = sLMP;
            if (sCy) document.getElementById('cycleLen').value = sCy;
            switchMode('lmp');
          }
        } else {
          var sDue = localStorage.getItem('pwtSavedDue');
          if (sDue && document.getElementById('dueDate')) {
            document.getElementById('dueDate').value = sDue;
            switchMode('due');
          }
        }
      }
    }
});

  // ─────────────────────────────────────────────────────────
  //  MODE SWITCH
  // ─────────────────────────────────────────────────────────
  function switchMode(mode) {
    currentMode = mode;
    document.getElementById('lmpMode').style.display = mode === 'lmp' ? '' : 'none';
    document.getElementById('dueMode').style.display = mode === 'due' ? '' : 'none';
    document.getElementById('btnLMP').classList.toggle('active', mode === 'lmp');
    document.getElementById('btnDD').classList.toggle('active', mode === 'due');
}

  function setCalcError(message) {
    var error = document.getElementById('calcError');
    if (!error) return;
    if (message) {
      error.textContent = message;
      error.style.display = 'block';
    } else {
      error.textContent = '';
      error.style.display = 'none';
    }
  }

  function clearCalcError() {
    setCalcError('');
  }

  // ─────────────────────────────────────────────────────────
  //  CALCULATE
  // ─────────────────────────────────────────────────────────
  function calculate() {
    clearCalcError();
    console.log('calculate button pressed');
    var lmpDate;
    var cycleLen = parseInt(document.getElementById('cycleLen').value) || 28;
    var today = new Date(); today.setHours(0,0,0,0);

    if (cycleLen < 20 || cycleLen > 45) {
      document.getElementById('cycleLen').focus();
      setCalcError('Please enter a realistic cycle length between 20 and 45 days.');
      return;
    }

    if (currentMode === 'lmp') {
      var lmpVal = document.getElementById('lmpDate').value;
      if (!lmpVal) { document.getElementById('lmpDate').focus(); setCalcError('Please enter the first day of your last period.'); return; }
      lmpDate = new Date(lmpVal + 'T00:00:00');
  } else {
      var dueDateVal = document.getElementById('dueDate').value;
      if (!dueDateVal) { document.getElementById('dueDate').focus(); setCalcError('Please enter your due date.'); return; }
      var dueDate = new Date(dueDateVal + 'T00:00:00');
      if (dueDate > new Date(today.getTime() + 315 * 24 * 60 * 60 * 1000)) {
        document.getElementById('dueDate').focus();
        setCalcError('Please enter a due date within the next 45 weeks.');
        return;
      }
      // LMP = dueDate - 280 days (adjusted for cycle length deviation)
      lmpDate = new Date(dueDate.getTime() - (280 + (cycleLen - 28)) * 24 * 60 * 60 * 1000);
  }

    if (lmpDate > today) { setCalcError('The first day of your last period cannot be in the future.'); return; }

    // Save to localStorage so returning users don't have to re-enter
    try {
      localStorage.setItem('pwtSavedMode', currentMode);
      if (currentMode === 'lmp') {
        localStorage.setItem('pwtSavedLMP', document.getElementById('lmpDate').value);
        localStorage.setItem('pwtSavedCycle', document.getElementById('cycleLen').value);
      } else {
        localStorage.setItem('pwtSavedDue', document.getElementById('dueDate').value);
      }
    } catch(e) {}

    // Cycle-length adjusted ovulation offset
    var ovulationOffset = cycleLen - 14;
    // conceptualLMP = lmpDate (simplified from redundant math offset)
    var conceptualLMP = lmpDate;
    // Due date: LMP + 280 days (standard), adjusted for cycle
    var adjustedDays = 280 + (cycleLen - 28);
    var dueDate = new Date(lmpDate.getTime() + adjustedDays * 24 * 60 * 60 * 1000);

    var daysSinceLMP = Math.floor((today - lmpDate) / (24 * 60 * 60 * 1000));
    var weekNum = Math.max(1, Math.floor(daysSinceLMP / 7) + 1);
    var daysExtra = daysSinceLMP % 7;

    if (weekNum < 1) { setCalcError('Your last period date appears to be in the future. Please check the date.'); return; }
    if (weekNum > 45) { setCalcError('The date you entered is more than 45 weeks ago. Please check it.'); return; }

    var daysUntilDue = Math.ceil((dueDate - today) / (24 * 60 * 60 * 1000));
    var trimester = weekNum <= 12 ? 1 : weekNum <= 26 ? 2 : 3;
    var progress = Math.min((daysSinceLMP / 280) * 100, 100);

    // Update currentResult object globally
    currentResult = { weekNum, daysExtra, dueDate, daysUntilDue, trimester, progress, lmpDate };

    // Always render inline — pSEO pages are for Google, not for the user flow
    renderResult(currentResult);


    // Push AdSense only once, after the panel is visible and has a real width
    if (!window._adSlot1Pushed) {
      window._adSlot1Pushed = true;
      setTimeout(function() {
        try {
          (adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
          console.error('AdSense push failed');
        }
      }, 500);
    }

    trackEvent('calculate_week', { mode: currentMode });
}

  // ─────────────────────────────────────────────────────────
  //  MILESTONE HELPER
  // ─────────────────────────────────────────────────────────
  function getMilestone(w) {
    if (w === 1) return { icon: '🗓️', title: 'Week 1: Cycle begins!', sub: 'Your body is preparing for ovulation. It\'s the perfect time to optimize your health and start prenatal vitamins.' };
    if (w === 2) return { icon: '✨', title: 'Ovulation week!', sub: 'This is when conception typically happens. An egg is released and waiting to be fertilized.' };
    if (w === 3) return { icon: '🧬', title: 'Conception!', sub: 'The fertilized egg is traveling down the fallopian tube and rapidly dividing into a blastocyst.' };
    if (w === 4) return { icon: '🎉', title: 'Positive test!', sub: 'Congratulations — your journey has officially begun! Start folic acid 400mcg daily if you haven\'t already.' };
    if (w === 5) return { icon: '🩸', title: 'Missed period', sub: 'The pregnancy hormone hCG is now high enough to be clearly detected. The neural tube is beginning to form.' };
    if (w === 6) return { icon: '💓', title: 'Baby\'s heart is beating!', sub: 'A tiny heartbeat of 100–160 bpm has formed. You may see it flickering on an early scan this week.' };
    if (w === 7) return { icon: '🧠', title: 'Brain development', sub: 'Baby\'s brain is rapidly developing, generating about 100,000 new brain cells every minute!' };
    if (w === 8) return { icon: '🌱', title: 'All major organs are forming!', sub: 'This is one of the most critical development weeks. Heart, brain, liver, and kidneys are all being built.' };
    if (w === 9) return { icon: '🦴', title: 'Bones and muscles', sub: 'Tiny bones are beginning to ossify (harden) and baby is making small, spontaneous movements.' };
    if (w === 10) return { icon: '🎓', title: 'Graduating to a fetus!', sub: 'The embryonic stage is officially over. Baby is now a fetus, and the vital organs are fully formed and starting to function.' };
    if (w === 11) return { icon: '👣', title: 'Fingers and toes', sub: 'Baby\'s hands and feet are losing their webbing, and tiny tooth buds are forming under the gums.' };
    if (w === 12) return { icon: '🌟', title: 'Dating scan week!', sub: 'The 12-week scan confirms your due date and checks for chromosomal conditions. Miscarriage risk drops sharply after this point.' };
    if (w === 13) return { icon: '🌸', title: 'Second trimester — you made it!', sub: 'The worst of the symptoms are usually behind you now. Energy returns, nausea fades, and your bump begins to show.' };
    if (w === 14) return { icon: '👂', title: 'Practicing expressions', sub: 'Baby\'s facial muscles are getting a workout. They can squint, frown, and even suck their thumb.' };
    if (w === 15) return { icon: '👀', title: 'Sensing light', sub: 'Even though their eyes are fused shut, baby can now sense bright light from outside your belly.' };
    if (w === 16) return { icon: '🦋', title: 'First flutters', sub: 'You might start feeling \'quickening\' — tiny movements that feel like gas bubbles or butterfly wings.' };
    if (w === 17) return { icon: '🫀', title: 'Heartbeat getting stronger', sub: 'Baby\'s heartbeat is now easily detectable with a standard doppler and their hearing is starting to develop.' };
    if (w === 18) return { icon: '🤸', title: 'Acrobatics in the womb', sub: 'Baby is twisting, rolling, and punching inside the amniotic fluid. You\'ll feel these movements more distinctly soon.' };
    if (w === 19) return { icon: '🛡️', title: 'Protective coating', sub: 'A waxy white substance called vernix is forming to protect baby\'s delicate skin from the amniotic fluid.' };
    if (w === 20) return { icon: '🎊', title: 'Halfway there!', sub: 'Exactly halfway through your pregnancy! Your 20-week anatomy scan checks every organ in detail — and you may find out the sex.' };
    if (w === 21) return { icon: '👅', title: 'Taste buds forming', sub: 'Baby is swallowing amniotic fluid and can actually taste the different flavors of the food you eat!' };
    if (w === 22) return { icon: '🎶', title: 'Hearing your voice', sub: 'Baby\'s hearing is fully developed. They can hear your heartbeat, digestion, and the sound of your voice.' };
    if (w === 23) return { icon: '🫁', title: 'Breathing practice', sub: 'Baby is practicing breathing motions, drawing amniotic fluid into their developing lungs.' };
    if (w === 24) return { icon: '🏥', title: 'Viability milestone', sub: 'This is a major medical milestone. Babies born at 24 weeks now have a chance of survival with specialized NICU care.' };
    if (w === 25) return { icon: '✋', title: 'A firm grip', sub: 'Baby\'s hands are fully formed and they are learning to grip things, often holding onto their umbilical cord.' };
    if (w === 26) return { icon: '👁️', title: 'Eyes opening', sub: 'Baby\'s eyes are beginning to open and blink. They are starting to distinguish between light and dark.' };
    if (w === 27) return { icon: '👶', title: 'Third trimester begins!', sub: 'Baby is gaining weight rapidly now. You can feel strong movements every day. Start preparing your hospital bag.' };
    if (w === 28) return { icon: '💤', title: 'Dreaming away', sub: 'Baby is experiencing REM (Rapid Eye Movement) sleep, which means they are likely dreaming!' };
    if (w === 29) return { icon: '🦴', title: 'Bones hardening', sub: 'Baby\'s skeleton is hardening. Ensure you are getting plenty of calcium to support this rapid bone growth.' };
    if (w === 30) return { icon: '🧠', title: 'Brain folds forming', sub: 'Instead of being smooth, baby\'s brain is developing the characteristic grooves and folds to hold more brain tissue.' };
    if (w === 31) return { icon: '💪', title: 'Stronger kicks', sub: 'As space gets tighter, those flutters turn into sharp jabs and kicks. You might even see a foot press against your belly!' };
    if (w === 32) return { icon: '👶', title: 'Head down position', sub: 'Many babies start to turn cephalic (head down) around this time to prepare for birth.' };
    if (w === 33) return { icon: '🛡️', title: 'Immune system boost', sub: 'You are passing your antibodies to baby through the placenta, helping build their immune system for the outside world.' };
    if (w === 34) return { icon: '💅', title: 'Fingernails and toenails', sub: 'Tiny fingernails have reached the tips of baby\'s fingers. They might even scratch themselves in the womb.' };
    if (w === 35) return { icon: '⚖️', title: 'Gaining fat', sub: 'Baby is putting on about half a pound a week. This fat will help regulate their body temperature after birth.' };
    if (w === 36) return { icon: '🎈', title: 'Lungs maturing', sub: 'Baby\'s lungs are nearing full maturity and producing surfactant, a substance needed to keep air sacs open.' };
    if (w === 37) return { icon: '🎀', title: 'Early term!', sub: 'Baby is considered \'early term\'. Their organs are ready to function on their own. Rest and finalize your birth plan.' };
    if (w === 38) return { icon: '🍉', title: 'Shedding the vernix', sub: 'Baby is shedding their protective vernix and lanugo hair into the amniotic fluid, which they will swallow to form their first poop (meconium).' };
    if (w === 39) return { icon: '⏳', title: 'Any day now!', sub: 'Baby is fully formed and just waiting for the right moment. Keep an eye out for signs of labor.' };
    if (w === 40) return { icon: '✨', title: 'Due date week!', sub: 'Your estimated due date is this week. Only 5% of babies arrive exactly on time — stay calm and trust your body.' };
    if (w === 41) return { icon: '🤗', title: 'Baby is taking their time!', sub: 'Completely normal — babies often arrive up to 2 weeks after their due date. Your doctor or healthcare provider will monitor you closely.' };
    if (w >= 42) return { icon: '⏰', title: 'Time to meet baby', sub: 'If baby hasn\'t arrived yet, your doctor will likely discuss induction to ensure both you and baby stay safe.' };
    return null;
  }

  // ─────────────────────────────────────────────────────────
  //  SHARE RESULT
  // ─────────────────────────────────────────────────────────
  function shareResult() {
    if (!currentResult) return;
    var wk  = currentResult.weekNum;
    var due = formatDisplayDate(currentResult.dueDate);
    var txt = 'I\'m ' + wk + ' weeks pregnant! 🌸\nMy due date is ' + due + '\nFind out your pregnancy week free: https://www.pregnancyweektracker.com';  
    var btn = document.getElementById('shareBtn');
    if (navigator.share) {
      navigator.share({ title: 'My Pregnancy Week', text: txt }).catch(function() {});
  } else {
      var svgIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>';
      navigator.clipboard.writeText(txt).then(function() {
        btn.innerHTML = '✓ Copied to clipboard!';
        setTimeout(function() { btn.innerHTML = svgIcon + ' Share Your News'; }, 2500);
    }).catch(function() { prompt('Copy this to share:', txt); });
  }
}

  function copyGenderResult(encodedText) {
    var txt = decodeURIComponent(encodedText);
    var btn = document.getElementById('gCopyBtn');
    navigator.clipboard.writeText(txt).then(function() {
      btn.textContent = '✓ Copied!';
      setTimeout(function() { btn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy &amp; Share'; }, 2500);
  }).catch(function() { prompt('Copy this:', txt); });
}

  // ─────────────────────────────────────────────────────────
  //  RENDER RESULT
  // ─────────────────────────────────────────────────────────
  function renderResult(r) {
    var resultPanel = document.getElementById('resultPanel');
    if (resultPanel) {
        resultPanel.style.display = 'block';
        setTimeout(function() { resultPanel.classList.add('reveal'); }, 50);
    }
    
    var weekData = WEEKS.find(function(w) { return w.week === r.weekNum; }) || WEEKS[WEEKS.length - 1];
    var trimLabel = ['First', 'Second', 'Third'][r.trimester - 1] + ' Trimester';
    var daysStr = r.daysUntilDue >= 0 ? r.daysUntilDue + ' days to go' : Math.abs(r.daysUntilDue) + ' days overdue';

    // ── Celebratory headline ──────────────────────────────
    var weekWord = r.weekNum + ' week' + (r.weekNum === 1 ? '' : 's');
    var sizeNote = weekData.size_mm > 0 ? ' — about ' + (weekData.size_mm >= 10 ? (weekData.size_mm / 10).toFixed(1) + ' cm' : weekData.size_mm + ' mm') + ' long' : '';
    var dueNote  = r.daysUntilDue >= 0
      ? 'Due date: ' + formatDisplayDate(r.dueDate) + ' &nbsp;·&nbsp; ' + r.daysUntilDue + ' days to go'
      : formatDisplayDate(r.dueDate) + ' &nbsp;·&nbsp; ' + Math.abs(r.daysUntilDue) + ' days past your due date';
    var rh = document.getElementById('resultHeadline');
    rh.innerHTML =
      '<div class="rh-week">You\'re ' + weekWord + ' pregnant! 🌸</div>' +
      '<div class="rh-baby">Baby is the size of a <strong>' + weekData.size.toLowerCase() + '</strong>' + sizeNote + '</div>' +
      '<div class="rh-sub">' + dueNote + '</div>';
      
    if (!window.isMainPage) {
        rh.style.display = 'none';
    } else {
        rh.style.display = 'block';
    }

    // ── Milestone banner ──────────────────────────────────
    var ms = getMilestone(r.weekNum);
    var msBanner = document.getElementById('milestoneBanner');
    if (ms) {
      msBanner.innerHTML = '<span class="ms-icon">' + ms.icon + '</span><div class="ms-title">' + ms.title + '</div><div class="ms-sub">' + ms.sub + '</div>';
      msBanner.style.display = 'block';
  } else {
      msBanner.style.display = 'none';
  }

    // ── Show share row ────────────────────────────────────
    document.getElementById('shareRow').style.display = 'flex';

    // ── Size Visualizer ───────────────────────────────────
    updateSizeVisualizer(r.weekNum);

    // Stats grid
    document.getElementById('statGrid').innerHTML = [
      '<div class="result-stat"><div class="stat-value">Week ' + r.weekNum + '</div><div class="stat-label">Pregnancy Week</div><div class="stat-sub">' + r.daysExtra + ' day' + (r.daysExtra !== 1 ? 's' : '') + ' into this week</div></div>',
      '<div class="result-stat"><div class="stat-value">' + formatDisplayDate(r.dueDate) + '</div><div class="stat-label">Due Date (EDD)</div><div class="stat-sub">' + daysStr + '</div></div>',
      '<div class="result-stat"><div class="stat-value">' + trimLabel.split(' ')[0] + '</div><div class="stat-label">Trimester</div><div class="stat-sub">Weeks ' + (r.trimester === 1 ? '1–12' : r.trimester === 2 ? '13–26' : '27–40') + '</div></div>'
    ].join('');

    // Trimester bar
    var t1W = r.trimester === 1 ? 'font-weight:700;color:var(--primary)' : '';
    var t2W = r.trimester === 2 ? 'font-weight:700;color:var(--primary)' : '';
    var t3W = r.trimester === 3 ? 'font-weight:700;color:var(--primary)' : '';
    document.getElementById('trimBar').innerHTML =
      '<div class="trimester-labels"><span style="' + t1W + '">1st Trimester</span><span style="' + t2W + '">2nd Trimester</span><span style="' + t3W + '">3rd Trimester</span></div>' +
      '<div class="progress-track"><div class="progress-fill" style="width:' + r.progress.toFixed(1) + '%"></div></div>' +
      '<div class="trimester-dividers"><span class="tri-div">Week 1</span><span class="tri-div">Week 13</span><span class="tri-div">Week 27</span><span class="tri-div">Week 40</span></div>';

    var products = PRODUCTS[r.trimester === 1 ? 't1' : r.trimester === 2 ? 't2' : 't3'];

    // Week detail card
    document.getElementById('weekCard').innerHTML = generateWeekCardHtml(r.weekNum, weekData, products, trimLabel, currentImageTab);
    
    renderGrowthCurve(r.weekNum);
    updateSizeVisualizer(r.weekNum);
    renderWeeksTimeline(r.weekNum);
}

  function generateWeekCardHtml(weekNum, weekData, products, trimLabel, currentImageTab) {
    var isSingleMode = weekData.singleMode || weekNum <= 2;
    var cardImgTab = isSingleMode ? 'fruit' : currentImageTab;
    var headerImageEmoji = weekData[cardImgTab + 'Emoji'] || weekData.emoji;
    var headerImageLabel = isSingleMode
      ? (weekData.singleLabel || weekData.fruitLabel || weekData.size)
      : (weekData[cardImgTab + 'Label'] || weekData.size);
    var imgSrc = localWeekPhoto(weekNum, cardImgTab);
    var modalAlt = isSingleMode
      ? 'Week ' + weekNum + ' — ' + headerImageLabel
      : 'Week ' + weekNum + ' ' + cardImgTab + ' size comparison';
    
    var imgClickAttr = imgSrc ? ' onclick="openImgModal(\'' + imgSrc + '\', \'' + modalAlt + '\')" style="cursor:zoom-in" data-tooltip="Click to enlarge"' : '';

    var ttcBadge = (weekNum <= 3)
      ? ' <span class="ttc-badge" style="background:#fdf2f8;color:#db2777;border:1px solid #fbcfe8;padding:2px 8px;border-radius:12px;font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-left:8px;vertical-align:middle;display:inline-block;">Pre-Conception / TTC Phase</span>'
      : '';

    var checklistHtml = '';
    if (weekData.checklist && weekData.checklist.length > 0) {
      checklistHtml += '<div class="week-checklist-section" style="margin-top:24px;border-top:1px solid var(--border);padding-top:20px;">' +
        '<h3 style="font-size:1.1rem;color:var(--text);margin-bottom:12px;display:flex;align-items:center;gap:6px"><span>📝</span> Week ' + weekNum + ' Interactive Checklist</h3>' +
        '<p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:14px">Cross off tasks as you complete them. Your progress saves automatically.</p>' +
        '<div class="week-checklist-list" style="display:flex;flex-direction:column;gap:10px">';

      var checkState = {};
      try {
        var storedState = localStorage.getItem('pwtChecklistState');
        if (storedState) checkState = JSON.parse(storedState);
      } catch (e) {}

      weekData.checklist.forEach(function(item, idx) {
        var key = 'w' + weekNum + '_t' + idx;
        var checked = checkState[key] ? ' checked' : '';
        var completedStyle = checkState[key] ? 'text-decoration:line-through;opacity:0.6;' : '';

        checklistHtml += '<label class="week-checklist-item" style="display:flex;align-items:flex-start;gap:10px;cursor:pointer;font-size:0.9rem;color:var(--text);line-height:1.4">' +
          '<input type="checkbox" class="week-checklist-checkbox" data-key="' + key + '" onchange="toggleChecklistItem(' + weekNum + ', ' + idx + ')"' + checked + ' style="margin-top:3px;accent-color:var(--primary);width:16px;height:16px;cursor:pointer;">' +
          '<span class="week-checklist-text" id="lbl_' + key + '" style="' + completedStyle + '">' + item + '</span>' +
          '</label>';
      });
      checklistHtml += '</div></div>';
    }

    var privacySealHtml = 
      '<div class="privacy-trust-seal" style="margin-top:24px;display:flex;align-items:center;gap:8px;background:rgba(16,185,129,0.04);border:1px solid rgba(16,185,129,0.2);padding:12px 14px;border-radius:10px;font-size:0.8rem;color:#065f46;line-height:1.4">' +
        '<span style="font-size:1.2rem">🔒</span>' +
        '<div><strong>100% Privacy Guaranteed:</strong> Your pregnancy data is stored locally in your browser. We have no databases, require no login, and never track or sell your health history.</div>' +
      '</div>';

    var referencesHtml = 
      '<details open class="medical-sources-accordion" style="margin-top:16px;background:rgba(0,0,0,0.01);border:1px solid var(--border);border-radius:10px;padding:8px 12px;cursor:pointer;font-size:0.8rem;color:var(--text-muted)">' +
        '<summary style="font-weight:700;color:var(--text);outline:none;user-select:none;list-style:none;">🩺 Clinical Evidence & Medical References</summary>' +
        '<div style="margin-top:10px;line-height:1.5;cursor:default;">' +
          'This week&apos;s development and clinical guidance are verified against standard global medical guidelines:' +
          '<ul style="margin-top:6px;padding-left:18px;margin-bottom:0">' +
            '<li><strong>WHO (World Health Organization):</strong> Standards for pregnancy progression, gestational measurements, and pre-conception/prenatal nutritional recommendations.</li>' +
            '<li><strong>ACOG (American College of Obstetricians and Gynecologists):</strong> Clinical standards for prenatal screenings, genetic testing, and lifestyle boundaries (exercise, safe foods).</li>' +
            '<li><strong>NHS (National Health Service, UK):</strong> Pregnancy development milestones, fetal movement safety practices, and induction scheduling protocols.</li>' +
          '</ul>' +
        '</div>' +
      '</details>';

    var productsHtml = 
      '<div class="ui-curated-section" style="margin-top:24px">' +
      '<h2>Recommended for ' + trimLabel + ' <span class="ui-badge" style="background:rgba(255,107,152,0.1);color:var(--accent);padding:2px 8px;border-radius:12px;font-size:0.7rem;font-weight:700;text-transform:uppercase;margin-left:8px;border:1px solid rgba(255,107,152,0.2);">Affiliate</span></h2>' +
      '<p class="tip-sub" style="font-size:0.8rem;color:var(--text-muted);line-height:1.65;margin-top:10px;margin-bottom:16px;font-style:italic;">Shop curated products for this stage of pregnancy. Clicking and purchasing supports this free tool at no extra cost to you.</p>' +
      '<div class="ui-grid-layout">' +
      (products && products.length > 0 ? products.map(function(p) {
        return '<a class="ui-grid-card" href="' + amzLink(p.keyword) + '" target="_blank" rel="noopener noreferrer">' +
          '<div class="ui-grid-icon">' + p.icon + '</div>' +
          '<div><div class="ui-grid-title">' + p.name + '</div><div class="ui-grid-desc">' + p.why + '</div></div>' +
          '</a>';
      }).join('') : '') +
      '</div></div>';

    return '<div class="week-card-header">' +
        '<div class="week-image-box">' +
          '<div class="week-emoji"' + imgClickAttr + '>' + weekImg(weekNum, headerImageEmoji, cardImgTab) + '</div>' +
          (imgSrc ? '<div class="enlarge-hint">🔍 Tap to enlarge</div>' : '') +
          (!isSingleMode ? '<div class="week-image-tabs">' +
            '<button class="week-image-tab' + (currentImageTab === 'fruit' ? ' active' : '') + '" type="button" onclick="setWeekImageTab(&apos;fruit&apos;, ' + weekNum + ')">Food</button>' +
            '<button class="week-image-tab' + (currentImageTab === 'object' ? ' active' : '') + '" type="button" onclick="setWeekImageTab(&apos;object&apos;, ' + weekNum + ')">Object</button>' +
          '</div>' : '') +
        '</div>' +
        '<div class="week-header-content">' +
          '<div class="week-title-wrap">' +
            '<div class="week-number">Week ' + weekNum + ' of 40' + ttcBadge + '</div>' +
            '<div class="week-size">' + headerImageLabel + '</div>' +
            '<div class="week-size-sub">' + 
                (weekData.size_mm > 0 
                  ? 'Approx. ' + (weekData.size_mm / 10).toFixed(1) + ' cm / ' + (weekData.size_mm / 25.4).toFixed(1) + ' inches long' 
                  : 'Microscopic — not yet visible') + 
            '</div>' +
          '</div>' +
          '<div class="week-header-grid">' +
            '<div class="week-section"><h3><span>👶</span> Baby&apos;s Development</h3><p>' + weekData.baby + '</p></div>' +
            '<div class="week-section"><h3><span>🤰</span> What You May Feel</h3><p>' + weekData.mom + '</p></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="week-card-body">' +
        '<div class="week-tip"><span>💡</span><span><strong>This week&apos;s tip:</strong> ' + weekData.tip + '</span></div>' +
        checklistHtml +
        privacySealHtml +
        referencesHtml +
        productsHtml +
      '</div>';
  }

  // ─────────────────────────────────────────────────────────
  //  RENDER WEEKS TIMELINE
  // ─────────────────────────────────────────────────────────
  function renderWeeksTimeline(currentWeek) {
    var trimesters = [
      { label: 'First Trimester', range: [1, 12] },
      { label: 'Second Trimester', range: [13, 26] },
      { label: 'Third Trimester', range: [27, 42] }
    ];
    var html = '';
    var onMainPage = !!window.isMainPage;
    trimesters.forEach(function(tri) {
      html += '<div class="tri-group">';
      html += '<div class="tri-group-title"><span class="tri-badge">' + tri.label + '</span> Weeks ' + tri.range[0] + '–' + tri.range[1] + '</div>';
      html += '<div class="weeks-grid">';
      for (var w = tri.range[0]; w <= tri.range[1]; w++) {
        var wd = WEEKS.find(function(x) { return x.week === w; });
        if (!wd) continue;
        var isCurrent = currentWeek !== null && w === currentWeek;
        // Weeks 1-2 are single-mode: always show fruit image, ignore object tab
        var chipTab = (w <= 2) ? 'fruit' : currentImageTab;
        var weekChipLabel = wd.singleLabel || wd[chipTab + 'Label'] || wd.size;
        if (onMainPage) {
          // On the homepage: clicking a tile shows the full rich week detail INLINE
          html += '<div role="button" tabindex="0" onclick="showWeekDetail(' + w + ')" onkeydown="if(event.key===\'Enter\'||event.key===\' \')showWeekDetail(' + w + ')" class="week-chip' + (isCurrent ? ' current' : '') + (currentWeek === w ? ' active-detail' : '') + '" data-week="' + w + '" data-tooltip="View Week ' + w + ' development details" style="cursor:pointer;">' +
            '<div class="week-chip-num">Week ' + w + (isCurrent ? ' ◀ You' : '') + '</div>' +
            '<div class="week-chip-emoji">' + weekImg(w, wd[chipTab + 'Emoji'] || wd.emoji, chipTab) + '</div>' +
            '<div class="week-chip-size">' + weekChipLabel + '</div>' +
            '</div>';
        } else {
          // On pSEO pages: link to the dedicated week page for SEO
          html += '<a href="' + w + '-weeks-pregnant.html" class="week-chip' + (isCurrent ? ' current' : '') + '" data-week="' + w + '" data-tooltip="View Week ' + w + ' development details" style="text-decoration: none; color: inherit;">' +
            '<div class="week-chip-num">Week ' + w + (isCurrent ? ' ◀ You' : '') + '</div>' +
            '<div class="week-chip-emoji">' + weekImg(w, wd[chipTab + 'Emoji'] || wd.emoji, chipTab) + '</div>' +
            '<div class="week-chip-size">' + weekChipLabel + '</div>' +
            '</a>';
        }
    }
      html += '</div></div>';
  });
    var timelineEl = document.getElementById('weeksTimeline');
    if (timelineEl) {
        timelineEl.innerHTML = html;
    }
}


  window.toggleChecklistItem = function(weekNum, idx) {
    var key = 'w' + weekNum + '_t' + idx;
    var checkbox = document.querySelector('input[data-key="' + key + '"]');
    var labelText = document.getElementById('lbl_' + key);
    
    if (checkbox && labelText) {
      var isChecked = checkbox.checked;
      if (isChecked) {
        labelText.style.textDecoration = 'line-through';
        labelText.style.opacity = '0.6';
        labelText.classList.add('completed');
      } else {
        labelText.style.textDecoration = 'none';
        labelText.style.opacity = '1.0';
        labelText.classList.remove('completed');
      }
      
      try {
        var checkState = {};
        var storedState = localStorage.getItem('pwtChecklistState');
        if (storedState) {
          checkState = JSON.parse(storedState);
        }
        checkState[key] = isChecked;
        localStorage.setItem('pwtChecklistState', JSON.stringify(checkState));
      } catch (e) {
        console.error('Failed to save checklist state', e);
      }
    }
  };

  function showWeekDetail(weekNum) {
    try {
      var debug = document.getElementById('debugOutput');
      if (debug) debug.innerHTML = "Starting showWeekDetail for week: " + weekNum;

      var wd = WEEKS.find(function(w) { return w.week === weekNum; });
      if (!wd) return;

      trackEvent('select_pregnancy_week', { week: weekNum });

      // Highlight the tapped chip, clear previous highlight
      document.querySelectorAll('.week-chip').forEach(function(c) { c.classList.remove('active-detail'); });
      var chip = document.querySelector('.week-chip[data-week="' + weekNum + '"]');
      if (chip) chip.classList.add('active-detail');

      // Show the calculator-style result panel for a consistent week experience
      var resultPanel = document.getElementById('resultPanel');
      resultPanel.style.display = 'block';
      resultPanel.classList.add('reveal');
      document.getElementById('shareRow').style.display = 'none';

      var isIndia = USER_LOCALE.domain === 'amazon.in';
      var indiaNote = (wd.size_in && isIndia)
        ? '<div style="font-size:0.78rem;background:var(--accent-light);border-radius:8px;padding:8px 12px;margin-top:12px;border-left:3px solid var(--accent)">🇮🇳 Indian size equivalent: <strong>' + wd.size_in + '</strong></div>'
        : '';

      // Update headline when manually selecting a week so previous calc results don't stay visible
      document.getElementById('resultHeadline').innerHTML =
        '<div class="rh-week">Week ' + weekNum + ' selected</div>' +
        '<div class="rh-baby">Baby is the size of a <strong>' + wd.size.toLowerCase() + '</strong>' +
          (wd.size_mm > 0 ? ' — about ' + (wd.size_mm >= 10 ? (wd.size_mm / 10).toFixed(1) + ' cm long' : wd.size_mm + ' mm') : '') +
        '</div>' +
        '<div class="rh-sub">This is the week you tapped. The headline is now synced to the week card above.</div>';

      var ms = getMilestone(weekNum);
      var msBanner = document.getElementById('milestoneBanner');
      if (ms) {
        msBanner.innerHTML = '<span class="ms-icon">' + ms.icon + '</span><div class="ms-title">' + ms.title + '</div><div class="ms-sub">' + ms.sub + '</div>';
        msBanner.style.display = 'block';
      } else {
        msBanner.style.display = 'none';
      }

      // Determine trimester from week number for product recommendations
      var trimester = weekNum <= 12 ? 1 : weekNum <= 26 ? 2 : 3;
      var prodKey = trimester === 1 ? 't1' : trimester === 2 ? 't2' : 't3';
      var trimLabel = trimester === 1 ? 'First Trimester' : trimester === 2 ? 'Second Trimester' : 'Third Trimester';
      // Sync result panel stats and trimester bar to the selected week
      var daysSinceLMP = weekNum * 7;
      var daysExtra = 0;
      document.getElementById('statGrid').innerHTML = [
        '<div class="result-stat"><div class="stat-value">Week ' + weekNum + '</div><div class="stat-label">Pregnancy Week</div><div class="stat-sub">' + daysExtra + ' days into this week</div></div>',
        '<div class="result-stat"><div class="stat-value">—</div><div class="stat-label">Due Date (EDD)</div><div class="stat-sub">Estimate only</div></div>',
        '<div class="result-stat"><div class="stat-value">' + trimLabel.split(' ')[0] + '</div><div class="stat-label">Trimester</div><div class="stat-sub">Weeks ' + (trimester === 1 ? '1–12' : trimester === 2 ? '13–26' : '27–40') + '</div></div>'
      ].join('');
      document.getElementById('trimBar').innerHTML =
        '<div class="trimester-labels"><span' + (trimester===1?' style="font-weight:700;color:var(--primary)"':'') + '>1st Trimester</span><span' + (trimester===2?' style="font-weight:700;color:var(--primary)"':'') + '>2nd Trimester</span><span' + (trimester===3?' style="font-weight:700;color:var(--primary)"':'') + '>3rd Trimester</span></div>' +
        '<div class="progress-track"><div class="progress-fill" style="width:' + (Math.min((weekNum / 40) * 100, 100)).toFixed(1) + '%"></div></div>' +
        '<div class="trimester-dividers"><span class="tri-div">Week 1</span><span class="tri-div">Week 13</span><span class="tri-div">Week 27</span><span class="tri-div">Week 40</span></div>';
      
      renderGrowthCurve(weekNum);
      updateSizeVisualizer(weekNum);
      renderWeeksTimeline(weekNum);
      
      var products = PRODUCTS[prodKey];

      var weekCard = document.getElementById('weekCard');
      if (debug) debug.innerHTML += "<br>Generating HTML...";
      
      var htmlContent = generateWeekCardHtml(weekNum, wd, products, trimLabel, currentImageTab);
      
      console.log("DEBUG: weekCard element in DOM:", weekCard);
      console.log("DEBUG: length of generated HTML:", htmlContent ? htmlContent.length : 0);
      console.log("DEBUG: generated HTML preview:", htmlContent ? htmlContent.substring(0, 100) + '...' : 'null');
      
      if (weekCard) {
        weekCard.innerHTML = htmlContent;
        console.log("DEBUG: innerHTML set. New child element count:", weekCard.childElementCount);
        weekCard.style.display = 'block'; // Ensure it's visible
        if (debug) debug.innerHTML += "<br>Successfully assigned innerHTML. Content length: " + htmlContent.length;
      } else {
        if (debug) debug.innerHTML += "<br>weekCard element not found!";
      }

      // Only auto-scroll if we are on the main page (index.html).
      // On week pages, we want the user to see the hero title first!
      if (window.isMainPage) {
          smoothScrollTo(weekCard);
      }
    } catch (err) {
      var debug = document.getElementById('debugOutput');
      if (debug) debug.innerHTML = "<div style='color:red;font-weight:bold;background:#fee;padding:10px;border-radius:8px;'><b>Error in showWeekDetail:</b><br>" + err.message + "<br><pre>" + err.stack + "</pre></div>";
      console.error(err);
    }
  }

  function setWeekImageTab(tab, weekNum) {
    currentImageTab = tab;
    if (currentResult && currentResult.weekNum === weekNum) {
      renderResult(currentResult);
      renderWeeksTimeline(weekNum);
    } else {
      showWeekDetail(weekNum);
    }
  }

  // ─────────────────────────────────────────────────────────
  //  RENDER FAQ
  // ─────────────────────────────────────────────────────────
  function renderFAQ() {
    var faqList = document.getElementById('faqList');
    if (!faqList) return;
    faqList.innerHTML = FAQS.map(function(f, i) {
      return '<div class="faq-item">' +
        '<div class="faq-q" id="fq' + i + '" onclick="toggleFAQ(' + i + ')">' +
          '<span>' + f.q + '</span>' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>' +
        '</div>' +
        '<div class="faq-a" id="fa' + i + '">' + f.a + '</div>' +
        '</div>';
  }).join('');
}

  function toggleFAQ(i) {
    var q = document.getElementById('fq' + i);
    var a = document.getElementById('fa' + i);
    q.classList.toggle('open');
    a.classList.toggle('open');
}

  function selectGenderOpt(el) {
    var group = el.dataset.group;
    document.querySelectorAll('.gender-opt[data-group="' + group + '"]').forEach(function(o) {
      o.classList.remove('selected');
  });
    el.classList.add('selected');
}

  function predictGender() {
    if (!document.getElementById('genderResult')) return;
    var votes = { boy: 0, girl: 0 };
    var details = [];
    var bpm = parseInt(document.getElementById('gBpm').value);
    if (!isNaN(bpm) && bpm >= 100 && bpm <= 200) {
      if (bpm > 140)      { votes.girl++; details.push('Heart rate ' + bpm + ' bpm → Girl'); }
      else if (bpm < 140) { votes.boy++;  details.push('Heart rate ' + bpm + ' bpm → Boy'); }
  }
    ['bump', 'sick', 'crav', 'skin', 'ramzi', 'ring', 'dream'].forEach(function(g) {
      var sel = document.querySelector('.gender-opt[data-group="' + g + '"].selected');
      if (sel && sel.dataset.val !== 'skip') {
        votes[sel.dataset.val]++;
        details.push(g + ' → ' + (sel.dataset.val === 'girl' ? 'Girl' : 'Boy'));
    }
  });
    var age = parseInt(document.getElementById('gAge').value);
    var month = parseInt(document.getElementById('gMonth').value);
    if (!isNaN(age) && !isNaN(month)) {
      var chResult = ((age + month + 1) % 2 === 0) ? 'girl' : 'boy';
      votes[chResult]++;
      details.push('Chinese calendar → ' + chResult);
  }
    var total = votes.boy + votes.girl;
    var resultEl = document.getElementById('genderResult');
    resultEl.style.display = '';
    if (total === 0) return;
    var girlPct = Math.round((votes.girl / total) * 100);
    var boyPct  = 100 - girlPct;
    var verdict = votes.girl > votes.boy ? 'girl' : votes.boy > votes.girl ? 'boy' : 'tie';
    var html = '<div class="gender-verdict ' + verdict + '">' + (verdict === 'girl' ? '👧 Girl' : '👦 Boy') + '</div>';
    html += '<div class="gender-meter-track"><div class="gender-meter-boy" style="width:'+boyPct+'%"></div><div class="gender-meter-girl" style="width:'+girlPct+'%"></div></div>';
    html += '<div class="gender-breakdown">Boy: ' + boyPct + '% · Girl: ' + girlPct + '%</div>';
    
    trackEvent('gender_quiz_result', { verdict: verdict });
    
    var shareText = 'Old wives\' tales say I\'m having a ' + (verdict === 'girl' ? 'girl 👧' : 'boy 👦') + '! Try it: https://www.pregnancyweektracker.com';
    html += '<div style="display:flex;gap:10px;justify-content:center;margin-top:16px">';
    html += '<a href="https://wa.me/?text=' + encodeURIComponent(shareText) + '" target="_blank" class="tool-btn-main" style="background:#25D366;text-decoration:none">WhatsApp</a>';
    html += '<button onclick="copyGenderResult(\'' + encodeURIComponent(shareText) + '\')" class="tool-btn-main">Copy</button></div>';
    resultEl.innerHTML = html;
}

  function updateSizeVisualizer(weekNum) {
    var safeW = Math.min(Math.max(weekNum - 1, 0), WEEKS.length - 1);
    var wd = WEEKS[safeW];
    var cm = wd.size_mm / 10;
    var inches = (wd.size_mm / 25.4).toFixed(1);
    var pct = Math.min((cm / 50) * 100, 100);
    var visHtml = '';
    
    var sizeStr = wd.size_mm < 1 ? 'Microscopic' : (cm.toFixed(1) + ' cm / ' + inches + ' in');
    var pctStr = wd.size_mm < 1 ? '0%' : (Math.round(pct) + '%');

    visHtml =
      '<div style="text-align:left;font-size:0.85rem;font-weight:700;color:var(--text);margin-bottom:8px;display:flex;justify-content:space-between">' +
        '<span>📏 Size Visualizer:</span>' +
        '<span style="color:var(--primary)">' + sizeStr + ' (' + pctStr + ')</span>' +
      '</div>' +
      '<div style="position:relative;height:12px;background:#e2e8f0;border-radius:6px;margin:28px 0 36px 0;">' +
        '<div style="width:' + pct + '%;height:100%;background:linear-gradient(90deg, var(--primary-light) 0%, var(--primary) 100%);border-radius:6px;"></div>' +
        '<div style="position:absolute;left:' + pct + '%;top:-8px;transform:translateX(-50%);width:16px;height:16px;background:var(--primary);border:3px solid #fff;border-radius:50%;box-shadow:0 2px 4px rgba(0,0,0,0.2)"></div>' +
        '<div style="position:absolute;left:17%;top:18px;transform:translateX(-50%);text-align:center;font-size:0.65rem;color:var(--text-muted);font-weight:700;white-space:nowrap;">' +
          '<div style="height:6px;width:1px;background:#cbd5e1;margin:0 auto 2px auto;"></div>Card<br>(8.5cm)' +
        '</div>' +
        '<div style="position:absolute;left:30%;top:18px;transform:translateX(-50%);text-align:center;font-size:0.65rem;color:var(--text-muted);font-weight:700;white-space:nowrap;">' +
          '<div style="height:6px;width:1px;background:#cbd5e1;margin:0 auto 2px auto;"></div>Phone<br>(15cm)' +
        '</div>' +
        '<div style="position:absolute;left:60%;top:18px;transform:translateX(-50%);text-align:center;font-size:0.65rem;color:var(--text-muted);font-weight:700;white-space:nowrap;">' +
          '<div style="height:6px;width:1px;background:#cbd5e1;margin:0 auto 2px auto;"></div>Ruler<br>(30cm)' +
        '</div>' +
        '<div style="position:absolute;right:0;top:18px;text-align:right;font-size:0.65rem;color:var(--text-muted);font-weight:700;white-space:nowrap;padding-right:2px;">' +
          '<div style="height:6px;width:1px;background:#cbd5e1;margin:0 4px 2px auto;"></div>Newborn<br>(50cm)' +
        '</div>' +
      '</div>';
      
    var container = document.getElementById('sizeVisualizerContainer');
    if (container) {
      container.innerHTML = visHtml;
    }
  }

  function renderGrowthCurve(currentWeek) {
    try {
      var container = document.getElementById('growthGraph');
      if (!container) return;
      
      var W = 1000; 
      var H = 240;
      var padding = { top: 30, right: 40, bottom: 80, left: 80 };
      var chartW = W - padding.left - padding.right;
      var chartH = H - padding.top - padding.bottom;
      
      var displayWeek = Math.max(1, Math.min(42, currentWeek || 1));
      var unit = chartW / 41;
      var points = [];

      for (var wk = 1; wk <= 42; wk++) {
        var data = null;
        for (var i = 0; i < WEEKS.length; i++) {
          if (WEEKS[i].week === wk) { data = WEEKS[i]; break; }
        }
        if (!data) continue;
        
        var x = padding.left + (wk - 1) * unit;
        var y = padding.top + chartH - (Math.min(data.size_mm || 0, 520) / 520) * chartH;
        points.push({ x: x, y: y, week: wk });
      }

      if (points.length === 0) return;

      var pathData = "M" + points[0].x + "," + points[0].y;
      var activePathData = "M" + points[0].x + "," + points[0].y;
      for (var i = 1; i < points.length; i++) {
        pathData += " L" + points[i].x + "," + points[i].y;
        if (points[i].week <= displayWeek) {
          activePathData += " L" + points[i].x + "," + points[i].y;
        }
      }

      var currentPoint = points[0];
      for (var i = 0; i < points.length; i++) {
        if (points[i].week === displayWeek) { currentPoint = points[i]; break; }
      }

      var svg = '<svg width="100%" height="100%" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid meet" style="overflow:visible">' +
        '<line x1="'+padding.left+'" y1="'+(padding.top+chartH)+'" x2="'+(padding.left+chartW)+'" y2="'+(padding.top+chartH)+'" stroke="#ddd" stroke-width="2" />' +
        '<line x1="'+padding.left+'" y1="'+padding.top+'" x2="'+padding.left+'" y2="'+(padding.top+chartH)+'" stroke="#ddd" stroke-width="2" />' +
        '<text x="'+(padding.left + chartW/2)+'" y="'+(H - 15)+'" text-anchor="middle" font-size="16" font-weight="800" fill="#444">PREGNANCY WEEKS (1—42)</text>';
        
        for(var i=0; i<42; i++) {
          var wkNum = i + 1;
          var tx = padding.left + i * unit;
          var isMilestone = wkNum === 1 || wkNum % 5 === 0 || wkNum === 42;
          
          svg += '<line x1="'+tx+'" y1="'+(padding.top+chartH)+'" x2="'+tx+'" y2="'+(padding.top+chartH + (isMilestone ? 12 : 6))+'" stroke="#ccc" stroke-width="'+(isMilestone ? 2 : 1)+'" />';
          if(isMilestone) {
            svg += '<text x="'+tx+'" y="'+(padding.top+chartH+35)+'" text-anchor="middle" font-size="12" font-weight="700" fill="#888">' + wkNum + '</text>';
          }
        }
        
        svg += 
        '<text x="25" y="'+(padding.top + chartH/2)+'" transform="rotate(-90, 25, '+(padding.top + chartH/2)+')" text-anchor="middle" font-size="16" font-weight="800" fill="#444">SIZE (mm)</text>' +
        '<text x="'+(padding.left-15)+'" y="'+(padding.top+chartH)+'" text-anchor="end" font-size="12" font-weight="700" fill="#888">0</text>' +
        '<text x="'+(padding.left-15)+'" y="'+padding.top+'" text-anchor="end" font-size="12" font-weight="700" fill="#888">520</text>' +
        '<path d="' + pathData + '" fill="none" stroke="#f4f4f4" stroke-width="4" stroke-dasharray="6" />' +
        '<path d="' + activePathData + '" fill="none" stroke="var(--primary)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />' +
        '<circle cx="' + currentPoint.x + '" cy="' + currentPoint.y + '" r="9" fill="var(--primary)" stroke="#fff" stroke-width="3">' +
          '<animate attributeName="r" values="9;12;9" dur="2s" repeatCount="indefinite" />' +
        '</circle>' +
        '</svg>';

      container.innerHTML = svg;
    } catch (e) { console.error("Graph Error:", e); }
  }

  function showGraphTooltip(e, week, mm) {
    var tt = document.getElementById('graphTooltip');
    tt.style.display = 'block';
    tt.style.left = (e.clientX + 10) + 'px';
    tt.style.top = (e.clientY - 30) + 'px';
    tt.innerHTML = 'Week ' + week + ': ' + mm + ' mm';
}

  function hideGraphTooltip() {
    document.getElementById('graphTooltip').style.display = 'none';
}
  function formatDateInput(d) {
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
}

  var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function formatDisplayDate(d) {
    if (!d) return '—';
    return d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear();
}
  // ─────────────────────────────────────────────────────────
  //  WAKE LOCK & LOCAL MEMORY INITIALIZATION
  // ─────────────────────────────────────────────────────────
  var wakeLock = null;
  async function requestWakeLock() {
    if ('wakeLock' in navigator) {
      try {
        wakeLock = await navigator.wakeLock.request('screen');
        console.log('Wake Lock acquired');
      } catch (err) {
        console.warn('Wake Lock request failed:', err);
      }
    }
  }
  function releaseWakeLock() {
    if (wakeLock !== null) {
      wakeLock.release().then(() => {
        wakeLock = null;
        console.log('Wake Lock released');
      });
    }
  }
  document.addEventListener('visibilitychange', async () => {
    if (wakeLock !== null && document.visibilityState === 'visible') {
      await requestWakeLock();
    }
  });

  //  KICK COUNTER LOGIC
  // ─────────────────────────────────────────────────────────
  var kcActive = false;
  var kcStartTime = null;
  var kcInterval = null;
  var kcHits = [];

  try {
    var storedKicks = localStorage.getItem('kcHits');
    if (storedKicks) {
      kcHits = JSON.parse(storedKicks);
    }
  } catch (e) {
    console.error('Failed to load kick counter history', e);
  }

  function kcFormatTime(ms) {
    if (ms < 0) ms = 0;
    var totalSec = Math.floor(ms / 1000);
    var m = Math.floor(totalSec / 60);
    var s = totalSec % 60;
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }

  function kcUpdateDisplay() {
    var count = kcHits.length;
    var kcCountEl = document.getElementById('kcCount');
    if (!kcCountEl) return;
    kcCountEl.innerText = count;
    
    // Update Progress Ring (Circumference is 502.6 for r=80)
    var ring = document.getElementById('kcProgressRing');
    if (ring) {
      var pct = Math.min(count / 10, 1);
      var offset = 502.6 - (pct * 502.6);
      ring.style.strokeDashoffset = offset;
    }

    if (kcStartTime) {
      document.getElementById('kcTimer').innerText = kcFormatTime(Date.now() - kcStartTime);
    }
  }

  function kcRecord() {
    if (!kcActive) {
      // Start new session
      kcActive = true;
      kcStartTime = Date.now();
      kcHits = [];
      try {
        localStorage.setItem('kcActive', 'true');
        localStorage.setItem('kcStartTime', kcStartTime);
        localStorage.setItem('kcHits', JSON.stringify(kcHits));
      } catch (e) {}
      requestWakeLock();

      document.getElementById('kcBtn').innerText = 'I Felt a Kick! 🦶';
      document.getElementById('kcStopBtn').style.display = 'inline-block';
      document.getElementById('kcEncourage').style.display = 'none';
      kcInterval = setInterval(kcUpdateDisplay, 1000);
      document.getElementById('kcHistory').innerHTML = '<div style="text-align:center;padding:10px;color:var(--text-muted);font-size:0.85rem">Session started. Tap when you feel a movement.</div>';
      trackEvent('start_kick_counter');
      return;
    }
    
    // Record kick
    kcHits.push(Date.now());
    try {
      localStorage.setItem('kcHits', JSON.stringify(kcHits));
    } catch (e) {}
    kcUpdateDisplay();
    
    // Haptic feedback feel (animation)
    var btn = document.getElementById('kcBtn');
    btn.style.transform = 'scale(0.92)';
    setTimeout(() => { btn.style.transform = ''; }, 100);

    // Show in history
    var d = new Date();
    var timeStr = d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
    
    var itemHtml = '<div class="history-card">' +
      '<div class="hc-left"><span class="hc-time">Kick #' + kcHits.length + '</span><span class="hc-date">' + timeStr + '</span></div>' +
      '<div class="hc-right">✅</div>' +
    '</div>';
    
    var hist = document.getElementById('kcHistory');
    if (kcHits.length === 1) hist.innerHTML = ''; // clear initial message
    hist.insertAdjacentHTML('afterbegin', itemHtml);

    // Goal reached?
    if (kcHits.length === 10) {
      document.getElementById('kcEncourage').style.display = 'block';
      trackEvent('complete_kick_session');
    }
  }

  function kcStop() {
    kcActive = false;
    clearInterval(kcInterval);
    try {
      localStorage.setItem('kcActive', 'false');
      localStorage.removeItem('kcStartTime');
    } catch (e) {}
    if (!ctActive) releaseWakeLock();

    document.getElementById('kcBtn').innerText = 'Start New Session';
    document.getElementById('kcStopBtn').style.display = 'none';
    // Keep history visible but show it's ended
    var hist = document.getElementById('kcHistory');
    hist.insertAdjacentHTML('afterbegin', '<div style="text-align:center;padding:8px;font-size:0.75rem;color:var(--text-muted);border-bottom:1px dashed #ccc;margin-bottom:10px">Session ended. Total: ' + kcHits.length + ' kicks.</div>');
  }

  // ─────────────────────────────────────────────────────────
  //  CONTRACTION TIMER LOGIC
  // ─────────────────────────────────────────────────────────
  var ctActive = false;
  var ctStartTime = null;
  var ctInterval = null;
  var ctHistoryList = []; // { start: ms, end: ms, duration: ms, interval: ms }
  var ctLastStart = null;

  try {
    var storedContractions = localStorage.getItem('ctHistoryList');
    if (storedContractions) {
      ctHistoryList = JSON.parse(storedContractions);
    }
    var storedCtLastStart = localStorage.getItem('ctLastStart');
    if (storedCtLastStart) {
      ctLastStart = parseInt(storedCtLastStart, 10);
    }
  } catch (e) {
    console.error('Failed to load contraction timer history', e);
  }

  function ctFormatDuration(ms) {
    if (ms < 0) ms = 0;
    var totalSec = Math.floor(ms / 1000);
    var m = Math.floor(totalSec / 60);
    var s = totalSec % 60;
    return (m > 0 ? m + 'm ' : '') + s + 's';
  }

  function ctUpdateDisplay() {
    if (ctActive && ctStartTime) {
      var elapsedMs = Date.now() - ctStartTime;
      var dur = ctFormatDuration(elapsedMs);
      var ctDurEl = document.getElementById('ctDuration');
      if (!ctDurEl) return;
      ctDurEl.innerText = dur;
      document.getElementById('ctBtn').innerText = 'STOP TIMER (' + dur + ') 🛑';
      
      var elapsedSec = Math.floor(elapsedMs / 1000);
      var cycleSec = elapsedSec % 8;
      var coachTextEl = document.getElementById('coachText');
      if (coachTextEl) {
        if (cycleSec < 4) {
          coachTextEl.innerText = 'Breathe In...';
        } else {
          coachTextEl.innerText = 'Breathe Out...';
        }
      }

      // Dynamic wave and intensity calculation (typical contraction peaks at 30s of a 60s window)
      var totalWindow = 60; // 60 seconds typical duration window
      var progress = Math.min(elapsedMs / (totalWindow * 1000), 1);
      // Bell curve formula: sin(pi * progress)
      var intensity = Math.sin(Math.PI * progress);
      var peakHeight = 85; // Max height of wave peak in SVG coordinate space (0-100)
      var currentHeight = peakHeight * intensity;
      var controlY = 100 - currentHeight;
      
      var wavePath = document.getElementById('ctWavePath');
      if (wavePath) {
        // Draw a smooth quadratic Bezier curve that rises and falls
        wavePath.setAttribute('d', 'M0,100 Q50,' + controlY + ' 100,100 Z');
      }
      
      var label = document.getElementById('ctIntensityLabel');
      if (label) {
        var labelText = 'Intensity: ';
        if (progress >= 1) {
          labelText += 'Rest & breathe easy 🧘';
        } else {
          if (intensity < 0.2) {
            labelText += (progress < 0.5 ? 'Gentle / Starting... 📈' : 'Fading / Almost done... ✨');
          } else if (intensity < 0.6) {
            labelText += (progress < 0.5 ? 'Building... 📈' : 'Subsiding... 📉');
          } else if (intensity < 0.9) {
            labelText += (progress < 0.5 ? 'Strong / Rising... ⚡' : 'Strong / Easing... 📉');
          } else {
            labelText += 'PEAKING (Breathe through it!) 🏔️';
          }
        }
        label.innerText = labelText;
      }
    }
  }

  function check511Rule() {
    if (ctHistoryList.length < 3) return;
    
    // The 5-1-1 Rule: 
    // 5: Contractions are 5 mins apart (interval <= 6 mins)
    // 1: Each lasts 1 full minute (duration >= 50-60s)
    // 1: Consistent for 1 hour (check timestamps of last 3-5)
    
    var recent = ctHistoryList.slice(0, 4); // check last 4 for better consistency
    var allGoodDuration = recent.every(c => c.duration >= 45000); // at least 45s (close enough to 1m)
    var allGoodInterval = recent.every(c => !c.interval || c.interval <= 360000); // 6 mins or less apart
    
    if (allGoodDuration && allGoodInterval) {
      document.getElementById('ctAlert').style.display = 'block';
    } else {
      document.getElementById('ctAlert').style.display = 'none';
    }
  }

  function ctRenderHistory() {
    var hist = document.getElementById('ctHistory');
    if (ctHistoryList.length === 0) {
      hist.innerHTML = '<div style="text-align:center;padding:10px;color:var(--text-muted);font-size:0.85rem">No history yet. Tap the button to start.</div>';
      return;
    }
    
    var html = ctHistoryList.map(function(c, i) {
      var d = new Date(c.start);
      var timeStr = d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      var durStr = ctFormatDuration(c.duration);
      var intStr = c.interval ? ctFormatDuration(c.interval) + ' apart' : 'First one';
      
      return '<div class="history-card">' +
        '<div class="hc-left"><span class="hc-time">' + timeStr + '</span><span class="hc-date">' + intStr + '</span></div>' +
        '<div class="hc-right" style="color:var(--primary)">' + durStr + '</div>' +
      '</div>';
    }).join('');
    
    hist.innerHTML = html;
  }

  function ctToggle() {
    var btn = document.getElementById('ctBtn');
    
    if (!ctActive) {
      // Start contraction
      ctActive = true;
      ctStartTime = Date.now();
      try {
        localStorage.setItem('ctActive', 'true');
        localStorage.setItem('ctStartTime', ctStartTime);
      } catch (e) {}
      requestWakeLock();
      
      btn.innerText = 'STOP TIMER (Contraction Ended) 🛑';
      btn.className = 'tool-btn-main btn-contraction-end';
      
      var coach = document.getElementById('ctCoach');
      if (coach) coach.style.display = 'block';
      var card = document.getElementById('contraction-timer');
      if (card) card.classList.add('active-contraction');
      
      var intervalSinceLast = ctLastStart ? (ctStartTime - ctLastStart) : null;
      document.getElementById('ctInterval').innerText = intervalSinceLast ? ctFormatDuration(intervalSinceLast) : '--';
      
      ctLastStart = ctStartTime;
      try {
        localStorage.setItem('ctLastStart', ctLastStart);
      } catch (e) {}
      ctInterval = setInterval(ctUpdateDisplay, 1000);
      ctUpdateDisplay(); // Update immediately
      trackEvent('record_contraction', { type: 'start' });
      
    } else {
      // Stop contraction
      ctActive = false;
      clearInterval(ctInterval);
      try {
        localStorage.setItem('ctActive', 'false');
        localStorage.removeItem('ctStartTime');
      } catch (e) {}
      if (!kcActive) releaseWakeLock();
      
      btn.innerText = 'Start Timer (Contraction Started) ⏱️';
      btn.className = 'tool-btn-main btn-contraction-pulse';
      
      var coach = document.getElementById('ctCoach');
      if (coach) coach.style.display = 'none';
      var card = document.getElementById('contraction-timer');
      if (card) card.classList.remove('active-contraction');
      
      var duration = Date.now() - ctStartTime;
      document.getElementById('ctDuration').innerText = ctFormatDuration(duration);
      
      // Save
      ctHistoryList.unshift({
        start: ctStartTime,
        end: Date.now(),
        duration: duration,
        interval: ctHistoryList.length > 0 ? (ctStartTime - ctHistoryList[0].start) : null
      });
      try {
        localStorage.setItem('ctHistoryList', JSON.stringify(ctHistoryList));
      } catch (e) {}
      
      ctRenderHistory();
      check511Rule();
      trackEvent('record_contraction', { type: 'stop', duration_ms: duration });
    }
  }

  function ctReset() {
    if (ctActive) ctToggle(); // stop if running
    ctHistoryList = [];
    ctLastStart = null;
    try {
      localStorage.removeItem('ctHistoryList');
      localStorage.removeItem('ctLastStart');
    } catch (e) {}
    if (!kcActive) releaseWakeLock();
    
    // Reset visual displays
    document.getElementById('ctDuration').innerText = '0s';
    document.getElementById('ctInterval').innerText = '--';
    var wavePath = document.getElementById('ctWavePath');
    if (wavePath) wavePath.setAttribute('d', 'M0,100 Q50,100 100,100 Z');
    var label = document.getElementById('ctIntensityLabel');
    if (label) label.innerText = 'Intensity: Gentle / Starting... 📈';
    
    document.getElementById('ctHistory').innerHTML = '';
    document.getElementById('ctAlert').style.display = 'none';
  }

  // Render stored data on page load
  document.addEventListener('DOMContentLoaded', function() {
    // 1. Restore Kick Counter if we had hits
    if (kcHits.length > 0) {
      var hist = document.getElementById('kcHistory');
      if (hist) {
        hist.innerHTML = '';
        kcHits.forEach(function(timestamp, index) {
          var d = new Date(timestamp);
          var timeStr = d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
          var itemHtml = '<div class="history-card">' +
            '<div class="hc-left"><span class="hc-time">Kick #' + (index + 1) + '</span><span class="hc-date">' + timeStr + '</span></div>' +
            '<div class="hc-right">✅</div>' +
          '</div>';
          hist.insertAdjacentHTML('afterbegin', itemHtml);
        });
        kcUpdateDisplay();
      }
    }
    
    // Resume active kick timer if tab was refreshed while active
    try {
      var activeKc = localStorage.getItem('kcActive') === 'true';
      var startKc = localStorage.getItem('kcStartTime');
      if (activeKc && startKc) {
        kcActive = true;
        kcStartTime = parseInt(startKc, 10);
        document.getElementById('kcBtn').innerText = 'I Felt a Kick! 🦶';
        document.getElementById('kcStopBtn').style.display = 'inline-block';
        kcInterval = setInterval(kcUpdateDisplay, 1000);
        requestWakeLock();
      }
    } catch (e) {}

    // 2. Restore Contraction history
    if (ctHistoryList.length > 0) {
      ctRenderHistory();
      check511Rule();
    }
    
    // Resume active contraction timer if active
    try {
      var activeCt = localStorage.getItem('ctActive') === 'true';
      var startCt = localStorage.getItem('ctStartTime');
      if (activeCt && startCt) {
        ctActive = true;
        ctStartTime = parseInt(startCt, 10);
        var btn = document.getElementById('ctBtn');
        btn.innerText = 'STOP TIMER 🛑';
        btn.className = 'tool-btn-main btn-contraction-end';
        
        var coach = document.getElementById('ctCoach');
        if (coach) coach.style.display = 'block';
        var card = document.getElementById('contraction-timer');
        if (card) card.classList.add('active-contraction');
        
        var intervalSinceLast = ctLastStart ? (ctStartTime - ctLastStart) : null;
        document.getElementById('ctInterval').innerText = intervalSinceLast ? ctFormatDuration(intervalSinceLast) : '--';
        
        ctInterval = setInterval(ctUpdateDisplay, 1000);
        ctUpdateDisplay(); // Update immediately
        requestWakeLock();
      }
    } catch (e) {}
  });

  // Modal logic
  function openImgModal(src, alt) {
    const modal = document.getElementById('imgModal');
    const modalImg = document.getElementById('imgModalContent');
    modal.style.display = 'flex';
    modalImg.src = src;
    modalImg.alt = alt;
    modal.focus();
}
  function closeImgModal() {
    document.getElementById('imgModal').style.display = 'none';
}

  function initTooltipLayer() {
    var tooltip = document.createElement('div');
    tooltip.id = 'pwtTooltip';
    tooltip.style.cssText = 'position:fixed;top:0;left:0;z-index:10001;pointer-events:none;display:none;max-width:280px;padding:10px 14px;background:rgba(15,23,42,0.94);color:#fff;border-radius:12px;box-shadow:0 20px 45px rgba(0,0,0,0.25);font-size:0.78rem;line-height:1.5;white-space:normal;word-break:break-word;';
    document.body.appendChild(tooltip);
    document.documentElement.classList.add('tooltip-js');

    var posTooltip = function(e) {
      var text = this.getAttribute('data-tooltip');
      if (!text) return;
      tooltip.innerText = text;
      tooltip.style.display = 'block';
      var padding = 12;
      var rect = tooltip.getBoundingClientRect();
      var x = e.clientX + 16;
      var y = e.clientY + 18;
      if (x + rect.width + padding > window.innerWidth) {
        x = e.clientX - rect.width - 16;
      }
      if (x < padding) x = padding;
      if (y + rect.height + padding > window.innerHeight) {
        y = e.clientY - rect.height - 18;
      }
      if (y < padding) y = padding;
      tooltip.style.left = x + 'px';
      tooltip.style.top = y + 'px';
    };

    var hideTooltip = function() {
      tooltip.style.display = 'none';
    };

    document.querySelectorAll('[data-tooltip]').forEach(function(el) {
      el.addEventListener('mouseenter', posTooltip);
      el.addEventListener('mousemove', posTooltip);
      el.addEventListener('mouseleave', hideTooltip);
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    initTooltipLayer();
  });

  // Close modal on Escape key press
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const modal = document.getElementById('imgModal');
      if (modal && modal.style.display === 'flex') {
        closeImgModal();
      }
    }
  });

  // Scroll Spy for sticky navbar highlights
  document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('#tracker, #all-weeks, #kick-counter, #contraction-timer, #gender-prediction, #faq');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    if (sections.length > 0 && navLinks.length > 0) {
      const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
              const href = link.getAttribute('href');
              if (href === '#' + id || (id === 'tracker' && href === '#tracker')) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        });
      }, observerOptions);

      sections.forEach(section => observer.observe(section));
    }
  });
