const WEEKS = [
    {
        "week": 1,
        "singleMode": true,
        "singleLabel": "Pre-pregnancy",
        "size": "Microscopic",
        "size_mm": 0.1,
        "emoji": "✨",
        "fruitEmoji": "🧂",
        "fruitLabel": "Sperm & Egg",
        "objectEmoji": "🥚",
        "objectLabel": "Sperm & Egg Model",
        "baby": "This is the first week of your cycle. Development hasn't started yet, but your follicles are maturing to release a healthy egg.",
        "mom": "Your menstrual period is underway. Estrogen levels are low, and your uterine lining is shedding to prepare for a new, nutrient-rich lining in the coming weeks.",
        "tip": "Start taking a prenatal vitamin containing 400mcg of folic acid daily. Ensure you consult a doctor or healthcare provider to select the right supplement.",
        "checklist": [
            "Purchase high-quality prenatal vitamins with folic acid",
            "Record the first day of your last menstrual period (LMP)",
            "Consult your doctor about chronic medications and lifestyle habits"
        ],
        "weight_g": 0
    },
    {
        "week": 2,
        "singleMode": true,
        "singleLabel": "Fertilization",
        "size": "Microscopic",
        "size_mm": 0.1,
        "emoji": "🥚",
        "fruitEmoji": "🥚",
        "fruitLabel": "Fertilized Egg",
        "objectEmoji": "🥚",
        "objectLabel": "Fertilized Egg Model",
        "baby": "Ovulation typically occurs around day 14. If a sperm fertilizes the egg, cell division begins immediately to form a blastocyst.",
        "mom": "Estrogen levels peak, making uterine lining thicker. You may notice clear, slippery cervical mucus (similar to raw egg whites) indicating peak fertility.",
        "tip": "Timing intercourse around ovulation maximizes conception chances. Avoid smoking, alcohol, and high-mercury fish starting now.",
        "checklist": [
            "Track ovulation symptoms (cervical mucus, temperature rise)",
            "Time intercourse to align with your peak fertility window",
            "Maintain a balanced, nutrient-dense diet and stay hydrated"
        ],
        "weight_g": 0
    },
    {
        "week": 3,
        "size": "Microscopic",
        "size_mm": 0.1,
        "emoji": "📌",
        "fruitEmoji": "🧂",
        "fruitLabel": "Crystal of Salt",
        "objectEmoji": "📌",
        "objectLabel": "Tip of a Needle",
        "baby": "The fertilized egg (blastocyst) travels down the fallopian tube and implants into the uterine lining, dividing into the embryo and the placenta.",
        "mom": "Implantation might trigger very light spotting or mild cramping (implantation cramping). Your body begins producing hCG hormones.",
        "tip": "Be patient during the two-week wait. Continue taking prenatal vitamins and avoid unnecessary medications unless approved by a doctor.",
        "checklist": [
            "Avoid heavy lifting and intense high-impact workouts",
            "Continue your daily folic acid or prenatal supplements",
            "Stay hydrated and prioritize sleeping well to support implantation"
        ],
        "weight_g": 0
    },
    {
        "week": 4,
        "size": "Poppy Seed",
        "size_mm": 1.0,
        "emoji": "🌺",
        "fruitEmoji": "🌺",
        "fruitLabel": "Poppy Seed",
        "objectEmoji": "📌",
        "objectLabel": "Grain of Sand",
        "baby": "The embryo splits into three layers (ectoderm, mesoderm, and endoderm) which will form organs, skeleton, neural tube, and skin.",
        "mom": "A home pregnancy test should now show a positive result. Hormones may cause breast tenderness, fatigue, bloating, and light nausea.",
        "tip": "Book your first prenatal appointment. Confirm details of your health insurance coverage or maternal health system options.",
        "checklist": [
            "Take a home pregnancy test using first morning urine",
            "Call your doctor or healthcare provider to schedule your first scan",
            "Calculate your estimated due date (EDD) based on your LMP"
        ],
        "weight_g": 0.001
    },
    {
        "week": 5,
        "size": "Sesame Seed",
        "size_mm": 3.0,
        "emoji": "🌻",
        "fruitEmoji": "🌻",
        "fruitLabel": "Sesame Seed",
        "objectEmoji": "⚫",
        "objectLabel": "BB Pellet",
        "baby": "The neural tube is closing, and the heart is beginning to beat and pump blood. Early blood vessels and limbs are starting to emerge.",
        "mom": "hCG hormone levels are rising quickly. Fatigue, frequent urination, and morning sickness (nausea/vomiting) may start to feel intense.",
        "tip": "Sip ginger tea, eat small meals throughout the day, and drink plenty of water to help manage early nausea.",
        "checklist": [
            "Identify and avoid unpasteurized dairy, raw eggs, and deli meats",
            "Double check your cosmetics for retinoids or salicylic acid",
            "Sip ginger tea or chew ginger candies to ease early nausea"
        ],
        "weight_g": 0.01
    },
    {
        "week": 6,
        "size": "Sweet Pea",
        "size_mm": 5.0,
        "emoji": "🫘",
        "fruitEmoji": "🫘",
        "fruitLabel": "Sweet Pea",
        "objectEmoji": "🟡",
        "objectLabel": "Shirt Button",
        "baby": "Optic vesicles that will form eyes are developing, and tiny arm and leg buds are starting to grow. The jaw and chin are beginning to take shape.",
        "mom": "Hormonal surges can trigger mood swings and extreme fatigue. High blood flow makes breasts feel tender, heavy, and swollen.",
        "tip": "Wear a supportive, wireless bra. If plain water causes nausea, add lemon, cucumber slices, or switch to carbonated water.",
        "checklist": [
            "Keep plain crackers by your bedside to eat before getting up",
            "Schedule a dental checkup (pregnancy hormones affect gums)",
            "Wear a comfortable, supportive non-wired cotton bra"
        ],
        "weight_g": 0.02
    },
    {
        "week": 7,
        "size": "Blueberry",
        "size_mm": 10.0,
        "emoji": "🫐",
        "fruitEmoji": "🫐",
        "fruitLabel": "Blueberry",
        "objectEmoji": "✏️",
        "objectLabel": "Pencil Eraser Cap",
        "baby": "Brain cells are generating rapidly at 250,000 neurons per minute. Tiny nostrils, lenses, and hand plates are beginning to form.",
        "mom": "Your uterus has doubled in size. Increased blood supply and pelvic pressure can lead to frequent trips to the bathroom.",
        "tip": "Listen to your body and rest when tired. Drink at least 8 to 10 cups of water daily to support the amniotic fluid volume.",
        "checklist": [
            "Plan a resting schedule with 8-9 hours of nightly sleep",
            "Focus on complex carbs like oats and whole wheat to reduce nausea",
            "Stay hydrated: aim for 2.5 liters of clean water daily"
        ],
        "weight_g": 0.1
    },
    {
        "week": 8,
        "size": "Raspberry",
        "size_mm": 16.0,
        "emoji": "🍒",
        "fruitEmoji": "🍒",
        "fruitLabel": "Raspberry",
        "objectEmoji": "🔵",
        "objectLabel": "Glass Marble",
        "baby": "Joints like elbows and wrists are forming, and toes are losing their webbing. Tiny muscles start contracting, allowing baby to wiggle.",
        "mom": "You may experience vivid dreams due to hormones and disturbed sleep. Nausea and smell sensitivities might peak around this week.",
        "tip": "Start a pregnancy journal! It’s a great way to track your feelings and milestones during this journey.",
        "checklist": [
            "Note down list of questions for your first prenatal scan",
            "Start tracking your physical symptoms daily in a logbook",
            "Learn about safe prenatal core-strengthening exercises"
        ],
        "weight_g": 1.0
    },
    {
        "week": 9,
        "size": "Green Olive",
        "size_mm": 23.0,
        "emoji": "🟢",
        "fruitEmoji": "🟢",
        "fruitLabel": "Green Olive",
        "objectEmoji": "🧱",
        "objectLabel": "Lego Brick (2x2)",
        "baby": "The heart has divided into four chambers, and toes/fingers are fully separate. The head is large, and eyes remain sealed shut.",
        "mom": "Estrogen and progesterone are high, causing bloating, mild headaches, and occasional mood shifts. Skin might look clearer or break out.",
        "tip": "Schedule your 12-week dating scan if you haven't yet. Focus on gentle walking to boost energy and blood circulation.",
        "checklist": [
            "Book your 12-week prenatal dating and screening scan",
            "Verify health insurance coverage for scans and labor costs",
            "Incorporate a 15-minute daily walk into your routine"
        ],
        "weight_g": 2.0
    },
    {
        "week": 10,
        "size": "Kumquat",
        "size_mm": 31.0,
        "emoji": "🍊",
        "fruitEmoji": "🍊",
        "fruitLabel": "Kumquat",
        "objectEmoji": "🎲",
        "objectLabel": "Standard Game Die",
        "baby": "Critical development is done. Baby is now a fetus and will focus on growing rapidly. Essential organs are formed, and tiny fingernails and bones are hardening.",
        "mom": "You may feel round ligament pain (sharp twinges in the lower abdomen) as your uterine support muscles stretch.",
        "tip": "Discuss NIPT (Non-Invasive Prenatal Testing) with your doctor. It's a simple blood test to check baby's health.",
        "checklist": [
            "Consult your doctor or healthcare provider about NIPT options",
            "Practice pelvic tilts to help ease round ligament pains",
            "Invest in a gentle, pregnancy-safe belly moisturizer"
        ],
        "weight_g": 4.0
    },
    {
        "week": 11,
        "size": "Fig",
        "size_mm": 41.0,
        "emoji": "🟣",
        "fruitEmoji": "🟣",
        "fruitLabel": "Fig",
        "objectEmoji": "💾",
        "objectLabel": "USB Flash Drive",
        "baby": "The baby can open and close hands, hiccup, and do somersaults. Hair follicles are forming on the scalp.",
        "mom": "Your blood volume has increased, which might make you feel warmer than usual. Hair and nails may grow thicker and faster.",
        "tip": "Your skin is stretching. Use a rich moisturizer on your belly to help with dryness and itching.",
        "checklist": [
            "Moisturize your belly, hips, and breasts after showering",
            "Eat calcium-rich foods like yogurt, almonds, and leafy greens",
            "Wear breathable cotton fabrics to manage feeling warm"
        ],
        "weight_g": 7.0
    },
    {
        "week": 12,
        "size": "Plum",
        "size_mm": 54.0,
        "emoji": "🍑",
        "fruitEmoji": "🍑",
        "fruitLabel": "Plum",
        "objectEmoji": "💄",
        "objectLabel": "Standard Lipstick Tube",
        "baby": "The kidneys are functioning, producing urine that contributes to amniotic fluid. Reflexes are developing rapidly, and baby can open and close fingers.",
        "mom": "Good news! The placenta is taking over hormone production, so morning sickness and extreme fatigue should start to ease up.",
        "tip": "12-week scan week! This is a major milestone where you get to see your baby's profile clearly.",
        "checklist": [
            "Attend your 12-week dating scan and collect the ultrasound photos",
            "Start budgeting for baby essentials and nursery setup",
            "Prepare your announcement plan for family and friends (if ready)"
        ],
        "weight_g": 14.0
    },
    {
        "week": 13,
        "size": "Kiwi Fruit",
        "size_mm": 74.0,
        "emoji": "🍑",
        "fruitEmoji": "🥝",
        "fruitLabel": "Kiwi Fruit",
        "objectEmoji": "⚪",
        "objectLabel": "Golf Ball",
        "baby": "Welcome to the second trimester! Fingerprints are forming. Bones begin hardening. Baby can make facial expressions — frowns and squints are visible on scan.",
        "mom": "Most women feel dramatically better from week 13. Energy returns, nausea fades, and the so-called 'pregnancy glow' often appears.",
        "tip": "The second trimester is ideal for exercise — prenatal yoga, swimming, and walking are all excellent choices.",
        "checklist": [
            "Begin doing pelvic floor (Kegel) exercises daily",
            "Browse maternity clothing options as your waistline expands",
            "Research safe travel guidelines for a second-trimester babymoon"
        ],
        "weight_g": 23.0
    },
    {
        "week": 14,
        "size": "Peach",
        "size_mm": 87.0,
        "emoji": "🍋",
        "fruitEmoji": "🍑",
        "fruitLabel": "Peach",
        "objectEmoji": "🔋",
        "objectLabel": "D-Cell Battery",
        "baby": "Baby makes sucking movements. Fine hair called lanugo covers the body for warmth. The liver produces bile; the spleen produces red blood cells.",
        "mom": "Round ligament pains may continue as your belly grows. Appetite often increases. Constipation and heartburn can begin now.",
        "tip": "A pregnancy pillow can dramatically improve sleep quality. Invest in one now before you really need it in the third trimester.",
        "checklist": [
            "Purchase a supportive U-shaped or C-shaped pregnancy pillow",
            "Eat high-fiber foods (beans, pears, oats) to prevent constipation",
            "Do 20-30 minutes of low-impact prenatal exercise (swimming, yoga)"
        ],
        "weight_g": 43.0
    },
    {
        "week": 15,
        "size": "Apple",
        "size_mm": 101.0,
        "emoji": "🍎",
        "fruitEmoji": "🍎",
        "fruitLabel": "Apple",
        "objectEmoji": "🖱️",
        "objectLabel": "Computer Mouse",
        "baby": "Taste buds form. Ears reach their final position — baby can now hear sounds from outside the womb. The skeleton is changing from cartilage to bone.",
        "mom": "You may feel the first faint flutters of baby movement — often described as butterflies or gas bubbles. Nosebleeds and gum sensitivity are common.",
        "tip": "Start talking and singing to your bump — baby can hear you now, and it supports early bonding.",
        "checklist": [
            "Practice side-sleeping on your left side using pillows",
            "Schedule a routine dental checkup for bleeding gums",
            "Take time to talk, read, or sing to your baby daily"
        ],
        "weight_g": 70.0
    },
    {
        "week": 16,
        "size": "Avocado",
        "size_mm": 116.0,
        "emoji": "🥑",
        "fruitEmoji": "🥑",
        "fruitLabel": "Avocado",
        "objectEmoji": "💡",
        "objectLabel": "Standard Light Bulb",
        "size_in": "Raw keri (green mango)",
        "baby": "Baby holds its head up. Eyes can sense light. Baby constantly moves, swallows amniotic fluid, and practises breathing movements.",
        "mom": "Your bump is clearly visible. Your 16-week routine screening check includes blood pressure and urine test.",
        "tip": "Now is a great time to buy maternity clothes. Your bump will grow rapidly from here and regular clothes will become very uncomfortable.",
        "checklist": [
            "Attend your 16-week routine prenatal checkup",
            "Research local antenatal and childbirthing classes",
            "Verify that all cleaning supplies used at home are pregnancy-safe"
        ],
        "weight_g": 100.0
    },
    {
        "week": 17,
        "size": "Pomegranate",
        "size_mm": 130.0,
        "emoji": "🍐",
        "fruitEmoji": "🍐",
        "fruitLabel": "Pomegranate",
        "objectEmoji": "🎲",
        "objectLabel": "Rubik's Cube",
        "baby": "Fat begins accumulating under baby's skin for insulation and energy. The umbilical cord thickens and strengthens. Heartbeat is about 140–150 bpm.",
        "mom": "Baby movements should be more clearly felt this week. Your centre of gravity is shifting — you may feel slightly off-balance.",
        "tip": "Pelvic floor exercises daily from now on — they prevent incontinence and significantly aid recovery after birth.",
        "checklist": [
            "Perform daily pelvic tilts to help ease lower back strain",
            "Invest in comfortable flat shoes with good arch support",
            "Drink extra fluids if you experience round ligament stretch pain"
        ],
        "weight_g": 140.0
    },
    {
        "week": 18,
        "size": "Bell Pepper",
        "size_mm": 142.0,
        "emoji": "🫑",
        "fruitEmoji": "🫑",
        "fruitLabel": "Bell Pepper",
        "objectEmoji": "⚾",
        "objectLabel": "Baseball",
        "baby": "Baby is about 14cm. The nervous system develops rapidly. Baby yawns, stretches, and makes sucking motions. A covering called myelin begins insulating nerve fibres.",
        "mom": "Your 20-week anomaly scan is typically booked now. Start thinking about your birth preferences and researching options.",
        "tip": "Research maternity leave and benefits in your country now — the paperwork deadlines often come around earlier than you expect.",
        "checklist": [
            "Confirm the date and time of your 20-week anomaly scan",
            "Avoid lying flat on your back; use a pillow block behind you",
            "Review maternity leave options and workplace notice periods"
        ],
        "weight_g": 190.0
    },
    {
        "week": 19,
        "size": "Mango",
        "size_mm": 153.0,
        "emoji": "🥭",
        "fruitEmoji": "🥭",
        "fruitLabel": "Mango",
        "objectEmoji": "🎮",
        "objectLabel": "Video Game Controller",
        "size_in": "Alphonso mango",
        "baby": "Vernix caseosa — a creamy white coating — forms on baby's skin to protect it. Sensory development accelerates: touch, taste, smell, sight, and hearing all advancing.",
        "mom": "Movements are stronger and more regular. Backache and sciatic nerve pain may start as posture changes under the weight of your bump.",
        "tip": "A physiotherapist or prenatal massage therapist can help with pelvic girdle pain and backache — don't just endure it.",
        "checklist": [
            "Do gentle calf stretches before going to bed",
            "Add magnesium-rich foods (spinach, pumpkin seeds) to meals",
            "Check that your daily vitamins include vitamin D3"
        ],
        "weight_g": 240.0
    },
    {
        "week": 20,
        "size": "Zucchini",
        "size_mm": 256.0,
        "emoji": "🍌",
        "fruitEmoji": "🥒",
        "fruitLabel": "Zucchini",
        "objectEmoji": "🥤",
        "objectLabel": "Soda Can",
        "baby": "Halfway there! Baby is now measured head to toe — about 25cm. In girls, the uterus has formed; in boys, the testes are descending. Baby can hear music.",
        "mom": "The anomaly scan this week checks all major organs in detail. This is one of the most exciting appointments of pregnancy.",
        "tip": "Start a baby registry now — you have time to research properly and won't be overwhelmed with a newborn yet.",
        "checklist": [
            "Attend your 20-week anomaly scan and review the results",
            "Begin drafting a baby registry list for nursery essentials",
            "Wear moisturizing belly cream to ease skin tightness"
        ],
        "weight_g": 300.0
    },
    {
        "week": 21,
        "size": "Ear of Corn",
        "size_mm": 267.0,
        "emoji": "🥕",
        "fruitEmoji": "🌽",
        "fruitLabel": "Ear of Corn",
        "objectEmoji": "📖",
        "objectLabel": "Standard Paperback Book",
        "baby": "Movements form a recognisable pattern — you'll start to learn your baby's active times. Rapid eye movements occur during sleep. Fingernails are fully formed.",
        "mom": "Heartburn and indigestion may intensify as the uterus pushes against your stomach. Sleeping with your head elevated helps.",
        "tip": "Shop for a maternity bra — your cup size will change significantly during pregnancy and nursing.",
        "checklist": [
            "Eat 5-6 small meals instead of 3 large meals to ease reflux",
            "Shop for nursing bras (your bust size will continue to adjust)",
            "Ensure you get enough iron through diet or supplements"
        ],
        "weight_g": 360.0
    },
    {
        "week": 22,
        "size": "Papaya",
        "size_mm": 278.0,
        "emoji": "🍈",
        "fruitEmoji": "🍈",
        "fruitLabel": "Papaya",
        "objectEmoji": "🧴",
        "objectLabel": "Insulated Water Bottle",
        "baby": "Baby weighs about 430g. Eyebrows and eyelashes have appeared. The sense of hearing is well developed — baby recognises your voice.",
        "mom": "Braxton Hicks contractions (practice contractions) may begin — irregular, painless tightening. Ankle swelling can start.",
        "tip": "Elevate your feet when sitting and stay well hydrated to reduce ankle swelling, which is very common from now on.",
        "checklist": [
            "Elevate your feet on a footstool when sitting down",
            "Drink at least 2.5 to 3 liters of water to manage swelling",
            "Read about different labor pain relief methods (epidural, gas)"
        ],
        "weight_g": 430.0
    },
    {
        "week": 23,
        "size": "Grapefruit",
        "size_mm": 289.0,
        "emoji": "🍊",
        "fruitEmoji": "🍊",
        "fruitLabel": "Grapefruit",
        "objectEmoji": "🔌",
        "objectLabel": "Standard Clothes Iron",
        "baby": "Baby has a real sleeping and waking cycle. The face is fully formed. Skin is still red and somewhat transparent as fat continues to accumulate underneath.",
        "mom": "Your uterus is now above your belly button. Weight gain of 5–8kg by now is typical. Stretch marks may begin appearing.",
        "tip": "Stretch mark creams applied twice daily can help — though genetics play a large role too.",
        "checklist": [
            "Moisturize your belly and hips twice daily",
            "Verify your glucose test scheduling for gestational diabetes",
            "Practice slow, calm breathing exercises daily"
        ],
        "weight_g": 500.0
    },
    {
        "week": 24,
        "size": "Eggplant",
        "size_mm": 300.0,
        "emoji": "🌽",
        "fruitEmoji": "🍆",
        "fruitLabel": "Eggplant",
        "objectEmoji": "🥛",
        "objectLabel": "1-Liter Milk Carton",
        "baby": "Baby reaches viability — a critical milestone. Born at 24 weeks, a baby has a chance of survival with intensive care. Lungs produce surfactant to work after birth.",
        "mom": "Glucose tolerance test screens for gestational diabetes. Tiredness and more frequent Braxton Hicks contractions are common.",
        "tip": "Know the signs of preterm labour: regular contractions, lower back pain, pelvic pressure, or unusual discharge. Call your doctor or healthcare provider if concerned.",
        "checklist": [
            "Complete your gestational diabetes glucose tolerance test",
            "Learn the signs of preterm labor (cramps, persistent backache)",
            "Finalize baby nursery safety inspections and setup"
        ],
        "weight_g": 600.0
    },
    {
        "week": 25,
        "size": "Cauliflower",
        "size_mm": 346.0,
        "emoji": "🧅",
        "fruitEmoji": "🥦",
        "fruitLabel": "Cauliflower",
        "objectEmoji": "🤧",
        "objectLabel": "Tissue Box",
        "size_in": "Shalgam (turnip)",
        "baby": "Baby responds to touch and sound consistently. Hair shows pigmentation. Hands are fully formed with well-developed fingerprints unique to your baby.",
        "mom": "You may feel baby hiccuping — a rhythmic pulsing sensation. Carpal tunnel syndrome (wrist tingling) is common in pregnancy.",
        "tip": "Write your birth plan now while you have time to research and discuss it calmly with your doctor or healthcare provider.",
        "checklist": [
            "Perform gentle hip opening stretches or prenatal yoga",
            "Discuss your birth preferences and plans with your partner",
            "Wear supportive wrist splints at night if tingling occurs"
        ],
        "weight_g": 660.0
    },
    {
        "week": 26,
        "size": "Acorn Squash",
        "size_mm": 356.0,
        "emoji": "🥬",
        "fruitEmoji": "🥒",
        "fruitLabel": "Acorn Squash",
        "objectEmoji": "🍾",
        "objectLabel": "Soda Bottle",
        "size_in": "Palak bunch (spinach)",
        "baby": "Baby's eyes open for the first time. Brainwave activity begins — your baby may dream! The immune system is developing as antibodies transfer from you to baby.",
        "mom": "The third trimester begins next week. Lower back pain and pelvic girdle pain can become more noticeable. Keep stretching and moving.",
        "tip": "Book antenatal classes now — they fill up fast. Check for online or local hospital options.",
        "checklist": [
            "Enroll in antenatal, labor, and newborn care classes",
            "Confirm that your hospital bag packing list is drafted",
            "Limit late-afternoon caffeine to help with insomnia"
        ],
        "weight_g": 760.0
    },
    {
        "week": 27,
        "size": "Cabbage",
        "size_mm": 366.0,
        "emoji": "🥦",
        "fruitEmoji": "🟢",
        "fruitLabel": "Cabbage",
        "objectEmoji": "🎳",
        "objectLabel": "Standard Bowling Pin",
        "baby": "Welcome to the third trimester! Baby weighs about 900g. Lungs are maturing but still need more time. Baby practises breathing by inhaling amniotic fluid.",
        "mom": "Sleep becomes more challenging. A U-shaped pregnancy pillow will transform your sleep quality. Heartburn, leg cramps, and frequent urination intensify.",
        "tip": "A good pregnancy pillow is the single best purchase for the third trimester. Invest in one this week — your sleep will thank you.",
        "checklist": [
            "Position a supportive pillow between your knees when sleeping",
            "Wash early baby clothes in gentle, non-bio detergent",
            "Practice diaphragmatic breathing to ease breathlessness"
        ],
        "weight_g": 875.0
    },
    {
        "week": 28,
        "size": "Spaghetti Squash",
        "size_mm": 376.0,
        "emoji": "🍆",
        "fruitEmoji": "🍈",
        "fruitLabel": "Spaghetti Squash",
        "objectEmoji": "📕",
        "objectLabel": "Thick Oxford Dictionary",
        "baby": "Baby weighs about 1kg. Eyes are fully open and can detect light. The brain grows rapidly, developing the characteristic folds that increase surface area.",
        "mom": "Your 28-week blood tests check for anaemia. You may start anti-D injections if you're Rh negative. Fetal movements should be monitored daily.",
        "tip": "Count fetal movements daily from now — 10 movements in 2 hours is reassuring. Call your doctor or healthcare provider if movements reduce significantly.",
        "checklist": [
            "Attend your 28-week routine screening and blood tests",
            "Perform a kick counting session daily at the same time",
            "Check your Rh negative status and discuss anti-D if needed"
        ],
        "weight_g": 1000.0
    },
    {
        "week": 29,
        "size": "Butternut Squash",
        "size_mm": 386.0,
        "emoji": "🥒",
        "fruitEmoji": "🥒",
        "fruitLabel": "Butternut Squash",
        "objectEmoji": "🪖",
        "objectLabel": "Kids' Bicycle Helmet",
        "size_in": "Lauki (bottle gourd)",
        "baby": "Baby weighs about 1.2kg. Muscles and lungs continue maturing. Fat accumulates rapidly. Baby's skin is less wrinkled as fat fills it out.",
        "mom": "Shortness of breath increases as your uterus pushes against your diaphragm. Sleep on your left side to improve circulation.",
        "tip": "Pack your hospital bag now — babies can arrive early. Include items for labour, delivery, and the postnatal ward.",
        "checklist": [
            "Pack your hospital bag with clothing and toiletries",
            "Avoid sitting cross-legged to optimize pelvic blood flow",
            "Practice labor wiggling and breathing styles weekly"
        ],
        "weight_g": 1150.0
    },
    {
        "week": 30,
        "size": "Cantaloupe",
        "size_mm": 399.0,
        "emoji": "🟢",
        "fruitEmoji": "🍈",
        "fruitLabel": "Cantaloupe",
        "objectEmoji": "🎳",
        "objectLabel": "Regulation Bowling Ball",
        "baby": "Baby can now regulate body temperature. Brain surface wrinkles are forming rapidly. The fine body hair (lanugo) begins to disappear.",
        "mom": "You may feel breathless and very tired. Pelvic pressure increases. Baby's kicks and rolls are reassuring signs of good health.",
        "tip": "Research infant CPR and first aid for babies — a short course before birth gives you confidence from day one.",
        "checklist": [
            "Book a pediatric first aid or baby CPR course",
            "Spend 15-20 minutes daily sitting on a birth ball",
            "Verify that your partner knows their role during labor"
        ],
        "weight_g": 1300.0
    },
    {
        "week": 31,
        "size": "Pineapple",
        "size_mm": 411.0,
        "emoji": "🥥",
        "fruitEmoji": "🍍",
        "fruitLabel": "Pineapple",
        "objectEmoji": "🍞",
        "objectLabel": "Toaster",
        "baby": "Baby can turn its head. Five senses are almost fully developed. Brain growth is accelerating. Baby's pupils react to light now.",
        "mom": "Braxton Hicks contractions are more frequent. Sleep is disrupted by discomfort, movements, and toilet trips. Rest whenever you can.",
        "tip": "Arrange a tour of your hospital's maternity unit — being familiar with the space reduces anxiety during labour.",
        "checklist": [
            "Tour your selected hospital or birthing center facility",
            "Verify all items on your nursery furniture checklist",
            "Prepare a postpartum recovery kit for yourself"
        ],
        "weight_g": 1500.0
    },
    {
        "week": 32,
        "size": "Honeydew Melon",
        "size_mm": 424.0,
        "emoji": "🥔",
        "fruitEmoji": "🍈",
        "fruitLabel": "Honeydew Melon",
        "objectEmoji": "📦",
        "objectLabel": "Shoebox",
        "size_in": "Shalgam (turnip)",
        "baby": "Baby weighs about 1.8kg. Survival rate if born now is over 95% with good neonatal care. Baby often moves into the head-down position this week.",
        "mom": "You're gaining about 500g per week now. Swelling of feet and ankles is common. Report sudden severe swelling to your doctor or healthcare provider immediately.",
        "tip": "Discuss pain relief options thoroughly with your doctor or healthcare provider — understand epidurals, gas and air, TENS machines, and water birth.",
        "checklist": [
            "Discuss pain relief preferences with your OB-GYN or doctor",
            "Walk 15-20 minutes daily to keep joints moving",
            "Report any sudden face or hand swelling to your doctor"
        ],
        "weight_g": 1700.0
    },
    {
        "week": 33,
        "size": "Coconut",
        "size_mm": 437.0,
        "emoji": "🍍",
        "fruitEmoji": "🥥",
        "fruitLabel": "Coconut",
        "objectEmoji": "💈",
        "objectLabel": "Foam Roller",
        "baby": "Baby's skull is hardening but remains soft enough to compress for birth. The immune system strengthens. Baby practises sucking and swallowing continuously.",
        "mom": "Pelvic pressure intensifies as baby engages. You may notice colostrum (first milk) leaking from your nipples — this is completely normal.",
        "tip": "Buy nursing pads now — you'll need them postpartum whether or not you plan to breastfeed, as colostrum may leak.",
        "checklist": [
            "Purchase nursing breast pads and nursing bras",
            "Install the baby car seat and verify it is secure",
            "Sterilize baby bottles and breast pump parts (if using)"
        ],
        "weight_g": 1900.0
    },
    {
        "week": 34,
        "size": "Watermelon",
        "size_mm": 450.0,
        "emoji": "🥝",
        "fruitEmoji": "🍉",
        "fruitLabel": "Watermelon",
        "objectEmoji": "🪖",
        "objectLabel": "Motorcycle Helmet",
        "size_in": "Kharbooja (musk melon)",
        "baby": "Baby's nails reach the fingertips. The central nervous system and lungs are almost fully mature. Baby is usually in a head-down position by now.",
        "mom": "Your doctor or healthcare provider will check baby's position at your 34-week appointment. Heartburn, backache, and tiredness are very common now.",
        "tip": "Freeze meals for the first weeks after birth now while you have the energy — cooking with a newborn is extremely difficult.",
        "checklist": [
            "Prepare and freeze 4-5 meals for postpartum weeks",
            "Pack baby's hospital outfits and receiving blankets",
            "Confirm the list of pediatricians in your local area"
        ],
        "weight_g": 2100.0
    },
    {
        "week": 35,
        "size": "Winter Melon",
        "size_mm": 462.0,
        "emoji": "🍏",
        "fruitEmoji": "🍈",
        "fruitLabel": "Winter Melon",
        "objectEmoji": "🎒",
        "objectLabel": "Backpack",
        "size_in": "Kharbooja (musk melon)",
        "baby": "Baby weighs about 2.4kg. Most development is complete — the next weeks are mainly about weight gain and final lung maturation.",
        "mom": "Monitor movements carefully — they should remain regular. Contact your doctor or healthcare provider if you notice a significant reduction in movement.",
        "tip": "Prepare your postpartum recovery kit: maternity pads, comfortable underwear, pain relief, witch hazel, and hospital-bag snacks.",
        "checklist": [
            "Double check your postpartum pads and underwear supply",
            "Sanitize all breast pump shields and parts",
            "Keep count of baby's rolls and movements daily"
        ],
        "weight_g": 2400.0
    },
    {
        "week": 36,
        "size": "Pumpkin",
        "size_mm": 474.0,
        "emoji": "🌿",
        "fruitEmoji": "🎃",
        "fruitLabel": "Pumpkin",
        "objectEmoji": "👜",
        "objectLabel": "Duffel Bag",
        "size_in": "Bunch of palak leaves",
        "baby": "Baby weighs about 2.7kg and gains 28g per day. Cheeks are chubby from fat deposits. Sucking muscles are strong and ready for feeding.",
        "mom": "Baby may 'drop' (engage into the pelvis) this week — you'll breathe more easily but feel more pelvic pressure and urgency to urinate.",
        "tip": "Register on your hospital's patient portal now and download any maternity apps they recommend for monitoring movements.",
        "checklist": [
            "Attend your 36-week prenatal checkup and GBS test",
            "Confirm hospital portal registration is fully completed",
            "Practice breathing coach exercises with the timer"
        ],
        "weight_g": 2600.0
    },
    {
        "week": 37,
        "size": "Watermelon",
        "size_mm": 486.0,
        "emoji": "🌱",
        "fruitEmoji": "🍉",
        "fruitLabel": "Watermelon",
        "objectEmoji": "🛌",
        "objectLabel": "Pillow",
        "size_in": "Bunch of methi (fenugreek)",
        "baby": "Baby is early term. Lungs are mature. Baby practises all skills for birth: sucking, swallowing, gripping, and breathing movements.",
        "mom": "You may notice the mucus plug passing ('bloody show') — a sign labour is approaching in the coming days or weeks.",
        "tip": "Know the difference between Braxton Hicks and real labour: real contractions become longer, stronger, and closer together over time.",
        "checklist": [
            "Pack labor snacks (honey, dry fruits, energy drinks)",
            "Ensure the car has a full tank of fuel for the hospital",
            "Verify the hospital parking area and labor ward entrance"
        ],
        "weight_g": 2900.0
    },
    {
        "week": 38,
        "size": "Pumpkin",
        "size_mm": 498.0,
        "emoji": "🪴",
        "fruitEmoji": "🎃",
        "fruitLabel": "Pumpkin",
        "objectEmoji": "🖥️",
        "objectLabel": "Desktop PC Tower",
        "baby": "Baby is full term. All organs function. Baby continues gaining fat. Vernix and lanugo shed and are swallowed into the amniotic fluid.",
        "mom": "The nesting instinct often kicks in strongly. Irregular contractions and backache may signal that labour is not far away.",
        "tip": "Double-check your hospital bag is packed. Make sure your birth partner knows the route, where to park, and which entrance to use.",
        "checklist": [
            "Practice pelvic floor wiggles to ease hip pressure",
            "Perform daily kick counts and write them down",
            "Verify birth partner emergency contact list is ready"
        ],
        "weight_g": 3100.0
    },
    {
        "week": 39,
        "size": "Jackfruit",
        "size_mm": 507.0,
        "emoji": "🍉",
        "fruitEmoji": "🍈",
        "fruitLabel": "Jackfruit",
        "objectEmoji": "🧺",
        "objectLabel": "Moses Basket",
        "baby": "Baby is 50cm and weighs about 3.3kg. The brain and lungs benefit enormously from every extra day inside the womb at this stage.",
        "mom": "You may feel every day is the day! Watch for: contractions 5 minutes apart for 1 hour, waters breaking, or strong bloody show.",
        "tip": "Prepare mentally for birth — hypnobirthing, breathing techniques, and visualisation are all clinically evidenced to help manage labour.",
        "checklist": [
            "Review the hospital labor protocol and 5-1-1 rule",
            "Prepare your home for returning (clean sheets, bassinet ready)",
            "Keep water and labor breathing playlist ready"
        ],
        "weight_g": 3300.0
    },
    {
        "week": 40,
        "size": "Watermelon",
        "size_mm": 512.0,
        "emoji": "🌕",
        "fruitEmoji": "🍉",
        "fruitLabel": "Watermelon",
        "objectEmoji": "💺",
        "objectLabel": "Car Seat",
        "size_in": "Kaddu (Indian pumpkin)",
        "baby": "This is your due date week! Baby is around 51cm and 3.4kg on average. Only about 5% of babies are born on their exact due date.",
        "mom": "If labour hasn't started, your doctor or healthcare provider will discuss membrane sweep or induction. Most babies arrive within 2 weeks of their due date.",
        "tip": "Rest. Trust your body. You are ready. However labour starts — you've got this.",
        "checklist": [
            "Perform daily kick counts and stay active with walking",
            "Verify diaper changing station is fully stocked",
            "Schedule your 41-week sweep or checkup appointment"
        ],
        "weight_g": 3500.0
    },
    {
        "week": 41,
        "size": "Pumpkin",
        "size_mm": 518.0,
        "emoji": "🎃",
        "fruitEmoji": "🎃",
        "fruitLabel": "Pumpkin",
        "objectEmoji": "⏲️",
        "objectLabel": "Microwave Oven",
        "baby": "Baby continues to grow. Placental function is monitored closely. Baby is considered overdue (post-term) this week.",
        "mom": "Induction is typically offered between 41 and 42 weeks. CTG monitoring checks baby's heart rate and movements regularly.",
        "tip": "Induction is a safe, well-evidenced option. Discuss it with your doctor or healthcare provider — it significantly reduces risk beyond 42 weeks.",
        "checklist": [
            "Attend CTG monitoring sessions at the hospital",
            "Discuss medical induction scheduling options with your doctor",
            "Prioritize hydration and rest as delivery approaches"
        ],
        "weight_g": 3700.0
    },
    {
        "week": 42,
        "size": "Jackfruit",
        "size_mm": 530.0,
        "emoji": "🎃",
        "fruitEmoji": "🍈",
        "fruitLabel": "Jackfruit",
        "objectEmoji": "🧳",
        "objectLabel": "Suitcase",
        "baby": "At 42 weeks most hospitals strongly recommend induction. Placental function naturally decreases after 42 weeks, so timing is important.",
        "mom": "You are post-term. Induction should be arranged. Amniotic fluid levels and placental function are closely monitored.",
        "tip": "Discuss all options with your doctor or healthcare provider. You are so close to meeting your baby — and they will be here very soon.",
        "checklist": [
            "Arrange hospital arrival for scheduled induction",
            "Confirm all birth bag items are in the car trunk",
            "Stay calm, practice slow breathing, you are ready!"
        ],
        "weight_g": 3900.0
    }
];
