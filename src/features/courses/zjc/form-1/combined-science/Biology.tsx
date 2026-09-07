import React, { useState, useRef,useEffect } from 'react';

/* ---------- Types ---------- */
type Explanation = { heading: string; text: string };
type Definition = { term: string; meaning: string };
type Table = { title: string; headers: string[]; rows: string[][] };
type Image = { src: string; alt: string; caption: string };

type Chapter = {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  explanations: Explanation[];
  definitions: Definition[];
  tables?: Table[];
  images?: Image[];
  keyPoints: string[];
  practicals?: string[];
  examFocus?: string[];
};

/* ---------- Helper: render text with bold support ---------- */
const renderBoldText = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
};

/* ---------- Chapter Data (same as before) ---------- */
const chapters: Chapter[] = [
  {
    id: 'cells-levels-organisation',
    eyebrow: 'Chapter 1',
    title: 'Cells and Levels of Organisation',
    summary: 'All living things are made of cells. A cell is the smallest unit of life that can carry out all life processes. In this chapter you learn the parts of plant and animal cells, what each part does, how the two cell types compare, and how cells are built up into a whole organism.',
    explanations: [
      {
        heading: 'What is a cell?',
        text: `A cell is the basic unit (building block) of all living things. In the 17th century, scientist Robert Hooke discovered that plants were made up of very small units, which he called "cells" because they reminded him of the small rooms (cells) that monks lived in.\n\n• Plants and animals are made up of small units of living material called cells.\n• A cell is the smallest structure that can carry out all life processes.\n• Some organisms (like bacteria) are single-celled; humans are made of trillions of cells.\n• Cells are microscopic – they can only be seen with a microscope.`,
      },
      {
        heading: 'Animal cell – structure and function',
        text: `An animal cell has three main parts, each with a specific job:\n\n• **Cell membrane** – a thin, flexible skin that holds the cell together and controls what enters and leaves (e.g., oxygen and food in; waste out).\n• **Cytoplasm** – a jelly‑like liquid where most of the cell's chemical reactions take place (e.g., releasing energy from food).\n• **Nucleus** – the control centre of the cell; it contains genes (DNA) that instruct the cell how to grow, develop, and carry out its job.`,
      },
      {
        heading: 'Plant cell – structure and function',
        text: `A plant cell has all the parts of an animal cell, plus three extra structures:\n\n• **Cell wall** – a tough, rigid layer made of cellulose outside the cell membrane; it gives the cell a fixed shape, provides support, and stops the cell from bursting when it takes in water.\n• **Large permanent vacuole** – a fluid‑filled sac containing cell sap; it pushes against the cell wall to keep the cell firm (turgid), helping the whole plant stand upright.\n• **Chloroplasts** – small green structures containing chlorophyll; they trap light energy for photosynthesis (making food). They are found only in green parts of the plant, such as leaves and young stems.`,
      },
      {
        heading: 'Functions of cell organelles (summary table)',
        text: 'The table below summarises the function of each organelle and whether it is found in plant cells, animal cells, or both.',
      },
      {
        heading: 'Similarities and differences between plant and animal cells',
        text: `Plant and animal cells share several features, but they also have important differences:\n\n• **Similarities**: Both have a cell membrane, cytoplasm, and a nucleus that controls the cell's activities.\n• **Differences**: Plant cells have a cell wall, a large permanent vacuole, and chloroplasts (in green parts). Animal cells do not have these structures.\n\nThe table below summarises the comparison in detail.`,
      },
      {
        heading: 'Levels of organisation',
        text: `Cells do not work alone – they are organised into increasingly complex levels:\n\n• **Cell** → the smallest unit (e.g., muscle cell, xylem cell).\n• **Tissue** → a group of similar cells working together (e.g., muscle tissue, xylem tissue).\n• **Organ** → different tissues working together to perform a specific job (e.g., heart, leaf).\n• **Organ system** → a group of organs working together for a major function (e.g., circulatory system, transport system).\n• **Organism** → all organ systems working together (e.g., human, plant).\n\nThis hierarchy allows living things to carry out all life processes efficiently.`,
      },
    ],
    definitions: [
      { term: 'Cell', meaning: 'The smallest structural and functional unit of a living organism.' },
      { term: 'Cell membrane', meaning: 'The thin outer layer that controls what enters and leaves a cell.' },
      { term: 'Cytoplasm', meaning: 'The jelly-like substance inside a cell where chemical reactions occur.' },
      { term: 'Nucleus', meaning: 'The control centre of the cell that holds the genes (DNA).' },
      { term: 'Cell wall', meaning: 'A rigid layer of cellulose outside a plant cell membrane that gives support.' },
      { term: 'Vacuole', meaning: 'A fluid-filled sac that keeps a plant cell firm (turgid).' },
      { term: 'Chloroplast', meaning: 'A green structure in plant cells where photosynthesis takes place.' },
      { term: 'Tissue', meaning: 'A group of similar cells working together to do the same job.' },
      { term: 'Organ', meaning: 'Different tissues working together, e.g. the heart or a leaf.' },
      { term: 'Organ system', meaning: 'A group of organs working together to perform a major body function.' },
    ],
    tables: [
      {
        title: 'Functions of cell organelles',
        headers: ['Organelle', 'Function', 'Present in plant cell?', 'Present in animal cell?'],
        rows: [
          ['Cell wall', 'Provides support and shape; prevents bursting', 'Yes', 'No'],
          ['Cell membrane', 'Controls movement of substances in and out', 'Yes', 'Yes'],
          ['Nucleus', 'Controls cell activities; contains DNA', 'Yes', 'Yes'],
          ['Cytoplasm', 'Site of chemical reactions', 'Yes', 'Yes'],
          ['Vacuole', 'Stores cell sap; keeps cell firm (turgid)', 'Large permanent vacuole', 'Small/temporary, if present'],
          ['Chloroplasts', 'Site of photosynthesis', 'Yes (in green parts)', 'No'],
        ],
      },
      {
        title: 'Plant cells vs. animal cells',
        headers: ['Feature', 'Animal cell', 'Plant cell'],
        rows: [
          ['Cell wall', 'Absent', 'Present (made of cellulose)'],
          ['Shape', 'Round or irregular', 'Fixed, often rectangular'],
          ['Vacuole', 'Small, temporary, or absent', 'Large, permanent, filled with cell sap'],
          ['Chloroplasts', 'Never present', 'Present in green parts'],
          ['Nucleus', 'Present', 'Present'],
          ['Cell membrane', 'Present', 'Present'],
          ['Cytoplasm', 'Present', 'Present'],
          ['Main energy source', 'Food eaten from other organisms', 'Made by photosynthesis'],
        ],
      },
      {
        title: 'Levels of organisation — worked examples',
        headers: ['Level', 'Human example', 'Plant example'],
        rows: [
          ['Cell', 'Muscle cell', 'Xylem cell'],
          ['Tissue', 'Muscle tissue', 'Xylem tissue'],
          ['Organ', 'Heart', 'Leaf'],
          ['Organ system', 'Circulatory system', 'Transport system'],
          ['Organism', 'Human', 'Plant'],
        ],
      },
    ],
    images: [
      {
        src: '/images/biology/cell-animal-labelled.png',
        alt: 'Labelled diagram of an animal cell',
        caption: 'An animal cell showing the cell membrane, cytoplasm and nucleus.',
      },
      {
        src: '/images/biology/cell-plant-labelled.png',
        alt: 'Labelled diagram of a plant cell',
        caption: 'A plant cell showing the cell wall, large vacuole, chloroplasts, membrane, cytoplasm and nucleus.',
      },
      {
        src: '/images/biology/levels-of-organisation.png',
        alt: 'Flow diagram: cell to tissue to organ to organ system to organism',
        caption: 'How cells build up into a whole organism.',
      },
    ],
    keyPoints: [
      'Animal cells have a cell membrane, cytoplasm and nucleus.',
      'Plant cells have those three parts plus a cell wall, a large vacuole and chloroplasts.',
      'The nucleus controls the cell; the cytoplasm is where reactions happen; the membrane controls what goes in and out.',
      'The cell wall gives support and shape; the vacuole keeps the cell firm; chloroplasts trap light for photosynthesis.',
      'Order of organisation: cell → tissue → organ → organ system → organism.',
    ],
    practicals: ['Look at onion skin and cheek cells under a microscope.', 'Draw and label a plant and an animal cell.'],
    examFocus: [
      'Label a plant and an animal cell.',
      'Compare plant and animal cells in a table.',
      'State the function of each cell part.',
      'Give the correct order of the levels of organisation.',
    ],
  },
  {
    id: 'nutrition',
    eyebrow: 'Chapter 2',
    title: 'Nutrition',
    summary: 'Nutrition means taking in and using food. Food gives us energy, materials to grow and repair, and substances that keep the body working well. A balanced diet contains the right amounts of all the food classes for a person\'s age, size and activity level.',
    explanations: [
      {
        heading: 'What is nutrition and a balanced diet?',
        text: `• **Nutrition** is the process of providing food that is necessary for good health and growth.\n• **Nutrients** are chemical substances in food that living things need to live – animals get them from food, plants from air, water and soil.\n• **Diet** is the food that a person eats.\n• A **balanced diet** contains different nutrients in the correct amounts, as well as water and fibre, for a particular person's needs (age, size, activity).`,
      },
      {
        heading: 'The seven components of a balanced diet',
        text: `A balanced diet is made up of seven components. Each has a specific role:\n1. Carbohydrates – main energy source.\n2. Proteins – growth and repair.\n3. Fats and oils – stored energy, insulation, organ protection.\n4. Vitamins – keep body processes healthy.\n5. Mineral salts – build bones, make blood cells, etc.\n6. Fibre (roughage) – helps food move through the gut.\n7. Water – essential for reactions, transport, and temperature control.\n\nThe table below gives detailed functions and food sources for each component.`,
      },
      {
        heading: 'Functions and sources of nutrients',
        text: 'The following table summarises the main functions and food sources of each nutrient, as well as the effects of deficiency.',
      },
      {
        heading: 'What makes a diet unbalanced?',
        text: `A diet becomes unbalanced when it lacks one or more nutrients, or contains far too much of another. For example:\n• Eating mostly sadza with very little protein, vegetables or fruit leads to deficiency diseases.\n• **Kwashiorkor** – caused by too little protein.\n• **Scurvy** – caused by too little vitamin C.\n• **Anaemia** – caused by too little iron.\n\nA balanced diet should combine foods from each of the seven groups every day.`,
      },
    ],
    definitions: [
      { term: 'Nutrition', meaning: 'The process of taking in and using food for energy, growth and health.' },
      { term: 'Nutrient', meaning: 'A useful substance found in food, e.g. protein or a vitamin.' },
      { term: 'Balanced diet', meaning: 'A diet with the correct amounts of all seven food components for a given person.' },
      { term: 'Fibre (roughage)', meaning: 'Indigestible plant material that adds bulk and keeps the gut healthy.' },
      { term: 'Deficiency disease', meaning: 'An illness caused by a lack of a particular nutrient, e.g. anaemia from too little iron.' },
    ],
    tables: [
      {
        title: 'Nutrients: functions, food sources and deficiency effects',
        headers: ['Nutrient', 'Main function', 'Food sources', 'Deficiency effects'],
        rows: [
          ['Carbohydrates', 'Quick energy supply', 'Sadza, rice, bread, potatoes, maize, sugar', 'Lack of energy, weight loss'],
          ['Proteins', 'Growth and repair of tissue', 'Meat, fish, eggs, beans, groundnuts, milk', 'Kwashiorkor, slow growth'],
          ['Fats and oils', 'Stored energy, insulation, organ protection', 'Cooking oil, butter, nuts, fatty meat', 'Weight loss, poor insulation'],
          ['Vitamins', 'Keep body processes healthy (e.g., immunity, vision)', 'Fruit, vegetables, liver, dairy', 'Scurvy (vitamin C), night blindness (vitamin A)'],
          ['Mineral salts', 'Build bones/teeth, make blood cells, etc.', 'Milk (calcium), leafy vegetables and liver (iron)', 'Anaemia (iron), weak bones (calcium)'],
          ['Fibre (roughage)', 'Helps movement of food through the gut, prevents constipation', 'Whole grains, vegetables, fruit skins', 'Constipation, bowel problems'],
          ['Water', 'Transport, chemical reactions, temperature control', 'Drinking water, fruit, soup', 'Dehydration, kidney problems'],
        ],
      },
    ],
    images: [
      {
        src: '/images/biology/balanced-diet-food-groups.png',
        alt: 'Plate diagram showing proportions of the seven food groups',
        caption: 'A balanced plate showing roughly how much of each food group is needed.',
      },
    ],
    keyPoints: [
      'Carbohydrates and fats give energy; proteins give growth and repair.',
      'Vitamins and minerals are needed in small amounts but keep the body healthy.',
      'Fibre prevents constipation; water is needed for transport, cooling and reactions.',
      'A balanced diet contains all seven food classes in the right amounts for the individual.',
      'An unbalanced diet can cause deficiency diseases such as anaemia, scurvy or kwashiorkor.',
    ],
    examFocus: [
      'Define nutrition, nutrient, diet and balanced diet.',
      'Complete a nutrient / function / food-source table.',
      'Explain why a variety of foods is important.',
      'Name a deficiency disease and the nutrient that is lacking.',
    ],
  },
  {
    id: 'respiratory-system',
    eyebrow: 'Chapter 3',
    title: 'Respiratory System and Air',
    summary: 'The air around us is a mixture of gases. Two of these gases, oxygen and carbon dioxide, are especially important for living things. In this chapter you learn the composition of air, how to identify the respiratory gases, and how to test for oxygen and carbon dioxide.',
    explanations: [
      {
        heading: 'The composition of air',
        text: `Air is a mixture of gases, not a single substance. Its percentage composition (by volume) is approximately:\n• Nitrogen – 78%\n• Oxygen – 21%\n• Carbon dioxide – 0.04%\n• Other gases (argon, water vapour, etc.) – about 1% (variable)\n\nWater vapour is not given a fixed percentage because its amount changes with weather and location.\nIn polluted air, harmful gases like carbon monoxide and sulfur dioxide increase, while oxygen and nitrogen percentages decrease.`,
      },
      {
        heading: 'Respiratory gases: oxygen and carbon dioxide',
        text: `• **Oxygen** is the reactive gas that allows living things to breathe and respire, and supports burning. Inhaled air has a high oxygen content (about 21%) and low carbon dioxide.\n• **Carbon dioxide** is produced when fuels burn or during respiration. It is present in very small amounts in the air but is essential for plants to make glucose during photosynthesis.\n\nThe table below compares inhaled and exhaled air.`,
      },
      {
        heading: 'Testing for oxygen – glowing splint test',
        text: `**Method:**\n1. Light a wooden splint and let it burn for a few seconds.\n2. Blow it out so that it is **glowing** (not flaming).\n3. Insert the glowing splint into a container of the test gas.\n\n**Observation:** If the gas is oxygen, the splint **relights** (bursts into flame).\n\n**Why?** Oxygen supports combustion more vigorously than ordinary air.`,
      },
      {
        heading: 'Testing for carbon dioxide – limewater test',
        text: `**Method:**\n1. Pour clear limewater into a test tube.\n2. Bubble the test gas through the limewater using a delivery tube or straw.\n\n**Observation:** If carbon dioxide is present, the limewater turns **milky** (cloudy white). The more CO₂, the faster and stronger the milkiness.\n\n**Why?** Carbon dioxide reacts with calcium hydroxide in limewater to form insoluble calcium carbonate, which is white and cloudy.`,
      },
      {
        heading: 'Comparing inhaled and exhaled air',
        text: `Inhaled air (breathed in) and exhaled air (breathed out) differ in several ways:\n\n• **Oxygen:** Inhaled ≈21%, exhaled ≈16% (used by cells for respiration).\n• **Carbon dioxide:** Inhaled ≈0.04%, exhaled ≈4% (produced as a waste product).\n• **Water vapour:** Inhaled is low/variable; exhaled is higher (saturated with moisture).\n• **Temperature:** Inhaled is usually cooler; exhaled is warmer (body temperature).\n\nThese differences can be demonstrated using limewater – exhaled air turns limewater milky much faster than inhaled air.`,
      },
    ],
    definitions: [
      { term: 'Combustion', meaning: 'Burning; a chemical reaction with oxygen that releases heat and light.' },
      { term: 'Respiration', meaning: 'The release of energy from food inside living cells, using oxygen.' },
      { term: 'Limewater', meaning: 'A clear solution that turns milky in the presence of carbon dioxide.' },
      { term: 'Diffusion (in the lungs)', meaning: 'Movement of oxygen and carbon dioxide between air and blood, from high to low concentration.' },
    ],
    tables: [
      {
        title: 'Approximate composition of air',
        headers: ['Gas', 'Approximate percentage'],
        rows: [
          ['Nitrogen', '78%'],
          ['Oxygen', '21%'],
          ['Carbon dioxide', '0.04%'],
          ['Other gases (argon) and water vapour', 'about 1% (variable)'],
        ],
      },
      {
        title: 'Inhaled air vs. exhaled air',
        headers: ['Gas / property', 'Inhaled air', 'Exhaled air'],
        rows: [
          ['Oxygen', 'About 21%', 'About 16%'],
          ['Carbon dioxide', 'About 0.04%', 'About 4%'],
          ['Water vapour', 'Low, variable', 'High (saturated)'],
          ['Temperature', 'Usually cooler', 'Warmer (body temperature)'],
        ],
      },
    ],
    images: [
      {
        src: '/images/biology/air-composition-piechart.png',
        alt: 'Pie chart of the percentage composition of air',
        caption: 'Air is mostly nitrogen and oxygen, with a small amount of carbon dioxide and other gases.',
      },
      {
        src: '/images/biology/oxygen-test-glowing-splint.png',
        alt: 'Diagram of the glowing splint test for oxygen',
        caption: 'A glowing splint relights when placed in oxygen gas.',
      },
      {
        src: '/images/biology/carbon-dioxide-test-limewater.png',
        alt: 'Diagram of the limewater test for carbon dioxide',
        caption: 'Bubbling carbon dioxide through clear limewater turns it milky.',
      },
    ],
    keyPoints: [
      'Air is about 78% nitrogen, 21% oxygen, and small amounts of carbon dioxide and water vapour.',
      'Oxygen and carbon dioxide are the main respiratory gases.',
      'A glowing splint relights in oxygen.',
      'Carbon dioxide turns limewater milky.',
      'Exhaled air has less oxygen and more carbon dioxide, water vapour and heat than inhaled air.',
    ],
    practicals: [
      'Test a gas for oxygen with a glowing splint.',
      'Test a gas for carbon dioxide with limewater.',
      'Blow exhaled air through limewater and compare the result with inhaled air.',
    ],
    examFocus: [
      'State the percentage composition of air.',
      'Name the two main respiratory gases.',
      'Describe the oxygen and carbon dioxide tests, including the positive result.',
      'Explain the differences between inhaled and exhaled air.',
    ],
  },
  {
    id: 'transport-systems',
    eyebrow: 'Chapter 4',
    title: 'Transport Systems',
    summary: 'Living things must move materials from one place to another. Plants move water up from the roots to the leaves, and animals use blood to carry substances around the body. This chapter looks at how water moves through a plant and at the structure and function of each part of blood.',
    explanations: [
      {
        heading: 'Water movement in plants',
        text: `Water and dissolved minerals are absorbed from the soil by **root hairs** – thin extensions of root surface cells. The water then travels upward through **xylem vessels** (narrow, tube‑like cells) that run through the root, stem, and into every leaf.\n\n**Why do plants need water?**\n• To keep cells firm (turgid) so the plant stands upright.\n• To carry dissolved minerals to growing parts.\n• To cool the plant as it evaporates from leaves (transpiration).\n• As a raw material for photosynthesis.\n\nIf a plant loses more water than it absorbs, its cells lose firmness and the plant wilts.`,
      },
      {
        heading: 'Diffusion',
        text: `**Diffusion** is the net movement of particles from a region of higher concentration to a region of lower concentration, down a concentration gradient. It happens because particles are always moving randomly, and it requires no extra energy.\n\n**Examples in biology:**\n• Oxygen moves from the lungs (high concentration) into the blood (low concentration).\n• Carbon dioxide moves from the blood (high) into the lungs (low) to be breathed out.\n• Digested food molecules move from the gut into the bloodstream.\n\nDiffusion can be demonstrated by placing a crystal of methylene blue in a beaker of water – the blue colour spreads evenly over time.`,
      },
      {
        heading: 'Osmosis',
        text: `**Osmosis** is a special type of diffusion – it is the movement of water molecules from a region of higher water concentration to a region of lower water concentration across a **semi‑permeable membrane** (a membrane that allows water through but not larger solute molecules).\n\nFor example, if a solution with sugar is separated from pure water by a semi‑permeable membrane, water will move from the pure water side (higher water concentration) to the sugar side (lower water concentration) until concentrations are equal.\n\nThis is how plant roots absorb water from the soil – the water concentration in the soil is higher than in the root cells, so water moves into the roots.`,
      },
      {
        heading: 'The four components of blood and their functions',
        text: `Blood is made up of four main components, each with a specific role:\n\n• **Plasma** – pale yellow liquid; carries dissolved food, waste products (like urea), hormones, and heat.\n• **Red blood cells** – disc‑shaped cells containing haemoglobin (red pigment); they bind to oxygen in the lungs and release it in tissues – this is how oxygen is transported.\n• **White blood cells** – larger, fewer cells that defend the body against disease by engulfing pathogens or producing antibodies.\n• **Platelets** – tiny cell fragments that help blood clot at wounds, sealing cuts and preventing blood loss and infection.\n\nThe table below summarises these components.`,
      },
    ],
    definitions: [
      { term: 'Root hair', meaning: 'A thin extension of a root cell that absorbs water and minerals from the soil.' },
      { term: 'Xylem', meaning: 'Plant tissue made of tube-like cells that carry water up the plant.' },
      { term: 'Transpiration', meaning: 'The loss of water vapour from the leaves of a plant.' },
      { term: 'Diffusion', meaning: 'Net movement of particles from a region of high to low concentration.' },
      { term: 'Osmosis', meaning: 'Movement of water molecules across a semi‑permeable membrane from high to low water concentration.' },
      { term: 'Plasma', meaning: 'The liquid part of blood that carries dissolved substances.' },
      { term: 'Haemoglobin', meaning: 'The red pigment in red blood cells that carries oxygen.' },
      { term: 'Platelets', meaning: 'Tiny cell fragments in blood that help it to clot.' },
    ],
    tables: [
      {
        title: 'Components of blood and their functions',
        headers: ['Component', 'Description', 'Function'],
        rows: [
          ['Plasma', 'Pale yellow liquid, most of blood volume', 'Carries dissolved food, waste, hormones and heat'],
          ['Red blood cells', 'Disc-shaped cells containing haemoglobin', 'Carry oxygen around the body'],
          ['White blood cells', 'Larger cells, fewer in number', 'Fight germs and disease'],
          ['Platelets', 'Tiny cell fragments', 'Help blood to clot and seal wounds'],
        ],
      },
    ],
    images: [
      {
        src: '/images/biology/water-movement-in-plants.png',
        alt: 'Diagram of water travelling from roots through the stem to the leaves',
        caption: 'Water is absorbed by root hairs and travels up the xylem to the leaves.',
      },
      {
        src: '/images/biology/blood-components-diagram.png',
        alt: 'Diagram of the four components of blood',
        caption: 'The four components of blood: plasma, red blood cells, white blood cells and platelets.',
      },
    ],
    keyPoints: [
      'Root hairs absorb water, which travels up the stem through xylem to the leaves.',
      'Water keeps cells firm, carries minerals, cools the plant and is used in photosynthesis.',
      'Diffusion moves particles from high to low concentration without using energy.',
      'Osmosis is the diffusion of water across a semi‑permeable membrane.',
      'Blood contains plasma, red blood cells, white blood cells and platelets.',
      'Red cells carry oxygen, white cells fight disease, platelets help clotting, plasma transports dissolved substances.',
    ],
    practicals: ['Stand a white flower in coloured water to show water movement.', 'Watch a dye spread in water to show diffusion.'],
    examFocus: [
      'Describe how water moves through a plant, naming the structures involved.',
      'State the function of each of the four parts of blood.',
      'Define diffusion and osmosis in simple terms and give a biological example of each.',
    ],
  },
  {
    id: 'reproduction',
    eyebrow: 'Chapter 5',
    title: 'Reproduction in Plants and Humans',
    summary: 'Reproduction is how living things produce new individuals of their own kind. Flowering plants reproduce using flowers, and humans reproduce sexually. This chapter also looks at the physical changes that happen during puberty as the body develops the ability to reproduce.',
    explanations: [
      {
        heading: 'The structure of a simple flower',
        text: `A flower is the reproductive structure of a flowering plant. Most flowers contain both male and female parts.\n\n**Male parts (stamen):**\n• **Anther** – produces pollen (containing male sex cells).\n• **Filament** – the stalk that supports the anther.\n\n**Female parts (carpel):**\n• **Stigma** – sticky surface that receives pollen.\n• **Style** – stalk connecting stigma to ovary.\n• **Ovary** – contains ovules (female sex cells).\n\n**Other parts:**\n• **Petals** – often colourful and scented to attract pollinators.\n• **Sepals** – small green leaves that protect the flower bud.`,
      },
      {
        heading: 'Pollination',
        text: `**Pollination** is the transfer of pollen grains from the anther to the stigma of a flower of the same species.\n\n• **Self‑pollination** – pollen moves to the stigma of the same flower or another flower on the same plant.\n• **Cross‑pollination** – pollen moves to the stigma of a flower on a different plant of the same species, usually carried by insects, wind, water or other animals.\n\nCross‑pollination increases genetic variety in the offspring. Pollinating agents include insects (bees), birds, wind, and water.`,
      },
      {
        heading: 'Fertilisation',
        text: `After pollination, a pollen grain on the stigma grows a **pollen tube** down through the style into the ovary. The male sex cell travels down the tube and fuses with the female sex cell inside the ovule – this is **fertilisation**.\n\n• A fertilised ovule becomes a **seed**.\n• The ovary often develops into a **fruit** around the seed.\n\nFertilisation is the union of male and female gametes (sex cells).`,
      },
      {
        heading: 'Puberty – physical and emotional changes',
        text: `**Puberty** is the stage when a child's body develops into an adult body capable of reproduction. It occurs at different ages and rates for different individuals.\n\n**Common changes in both sexes:**\n• Growth spurt (increase in height and weight).\n• Growth of underarm and pubic hair.\n• Increased sweat and oil gland activity (may cause acne).\n\n**In girls:**\n• Hips widen.\n• Breasts develop.\n• Menstruation (periods) begins – the monthly release of an egg and shedding of the womb lining.\n• May experience pre‑menstrual symptoms (PMS) like mood changes, breast sensitivity, cravings, and tiredness.\n\n**In boys:**\n• Shoulders broaden.\n• Voice deepens.\n• Facial hair grows.\n• Sperm production begins.\n• Penis becomes larger.\n\nPuberty is a normal, healthy part of growing up.`,
      },
    ],
    definitions: [
      { term: 'Stamen', meaning: 'The male part of a flower, made up of the anther and filament.' },
      { term: 'Carpel', meaning: 'The female part of a flower, made up of the stigma, style and ovary.' },
      { term: 'Pollination', meaning: 'Transfer of pollen from anther to stigma.' },
      { term: 'Fertilisation', meaning: 'The joining of a male and a female sex cell.' },
      { term: 'Puberty', meaning: 'The stage of development when the body becomes able to reproduce.' },
      { term: 'Menstruation', meaning: 'The monthly shedding of the womb lining in girls/women after puberty begins.' },
    ],
    tables: [
      {
        title: 'Puberty — common changes',
        headers: ['Change', 'Girls', 'Boys'],
        rows: [
          ['Growth', 'Growth spurt', 'Growth spurt'],
          ['Body hair', 'Underarm and pubic hair', 'Underarm, pubic and facial hair'],
          ['Body shape', 'Hips widen, breasts develop', 'Shoulders broaden, muscles increase'],
          ['Voice', 'Slight change', 'Deepens noticeably'],
          ['Reproductive milestone', 'Menstruation begins', 'Sperm production begins'],
        ],
      },
    ],
    images: [
      {
        src: '/images/biology/flower-structure-labelled.png',
        alt: 'Labelled diagram of a simple flower',
        caption: 'The parts of a flower: petal, sepal, stamen (anther and filament) and carpel (stigma, style and ovary).',
      },
      {
        src: '/images/biology/pollination-types-diagram.png',
        alt: 'Diagram comparing self-pollination and cross-pollination between flowers',
        caption: 'Self-pollination happens within one plant; cross-pollination happens between two plants.',
      },
      {
        src: '/images/biology/puberty-changes-icons.png',
        alt: 'Simple icon chart summarising the changes that happen during puberty',
        caption: 'A summary of common physical changes that occur during puberty.',
      },
    ],
    keyPoints: [
      'The stamen (anther + filament) is the male part; the carpel (stigma, style, ovary) is the female part of a flower.',
      'Pollination is the transfer of pollen; it can be self- or cross-pollination.',
      'Fertilisation is the joining of male and female sex cells; it happens after pollination.',
      'A fertilised ovule becomes a seed; the ovary can become a fruit.',
      'Puberty brings physical changes in both sexes, plus menstruation in girls and sperm production in boys.',
    ],
    examFocus: [
      'Label the parts of a flower.',
      'Explain the difference between pollination and fertilisation.',
      'Distinguish self-pollination from cross-pollination.',
      'List the changes that happen during puberty in girls and in boys.',
    ],
  },
  {
    id: 'health-diseases',
    eyebrow: 'Chapter 6',
    title: 'Health and Diseases',
    summary: 'Good health is more than just being free from disease – it means the body, the mind and our relationships with others are all working well. This chapter looks at what makes a healthy person, why hygiene matters, how diseases spread, and how waste can be safely disposed of.',
    explanations: [
      {
        heading: 'What describes a healthy person?',
        text: `Health is a state of **physical, mental and social well‑being**, not merely the absence of disease or infirmity.\n\n• **Physical well‑being** – all body functions work properly; free from illness; balanced diet, enough sleep and exercise.\n• **Mental well‑being** – emotional health; able to cope with normal stresses; realise your own abilities; interact with others and enjoy life.\n• **Social well‑being** – having friends and positive relationships; regular personal contact with others increases happiness and reduces stress.\n\nTo enjoy good health, a person needs proper shelter, a balanced diet, enough exercise, friends, adequate sleep and rest.`,
      },
      {
        heading: 'Importance of personal and food hygiene',
        text: `**Hygiene** means keeping yourself and your environment clean to prevent the spread of disease.\n\n**Personal hygiene practices:**\n• Shower/bath every day.\n• Brush teeth at least twice a day.\n• Wash hands before and after eating, and after using the toilet.\n• Change underwear daily.\n• Keep nails short and clean.\n• Wash hair often and keep it tidy.\n• Wear clean clothes every day.\n• Wash hands after blowing your nose or brushing hair.\n\n**Food hygiene practices:**\n• Wash hands with soap before handling food.\n• Wash hands after touching raw meat, poultry, or vegetables.\n• Store food at the correct temperature.\n• Cook food thoroughly; reheat pre‑cooked food only once.\n• Do not eat food past its expiry date.\n\nThese habits prevent contamination and the spread of pathogens.`,
      },
      {
        heading: 'Environmental hygiene and waste disposal',
        text: `Environmental hygiene means keeping the places where we live, study and work clean. Litter and waste attract pests and can spread disease.\n\n**Methods of waste disposal:**\n• **Landfill** – burying waste in a designated site. (Advantage: simple and cheap. Disadvantage: takes land, may pollute groundwater.)\n• **Incineration** – burning waste. (Advantage: reduces volume quickly. Disadvantage: can release toxic gases.)\n• **Recycling** – processing waste to make new products. (Advantage: saves resources, reduces landfill. Disadvantage: requires sorting and can be costly.)\n\nThe table below summarises these methods.`,
      },
      {
        heading: 'How diseases are transmitted',
        text: `Diseases are caused by **pathogens** – microorganisms such as bacteria, viruses, fungi, protozoa, and parasitic worms. They can spread in several ways:\n\n• **Contaminated food or water** – e.g., cholera, typhoid.\n• **Airborne droplets** – e.g., influenza, tuberculosis.\n• **Direct contact** – e.g., ringworm, scabies.\n• **Insect vectors** – e.g., malaria (mosquito), bilharzia (snail).\n• **Infected body fluids** – e.g., HIV.\n\nThe table below gives examples of diseases, their transmission routes, and prevention measures.\n\n**Examples of specific diseases:**\n• **Cholera** – caused by bacterium *Vibrio cholerae*; spread by contaminated water/food; prevention: clean water, handwashing, proper sanitation.\n• **Ebola** – caused by a virus; spread through body fluids; prevention: avoid contact with infected people, wash hands, do not eat bush meat.\n• **Malaria** – caused by a protozoan parasite; spread by female *Anopheles* mosquito; prevention: mosquito nets, repellent, no stagnant water.\n• **Bilharzia** – caused by a parasitic flatworm; spread through fresh water containing infected snails; prevention: avoid contact with contaminated water, boil water before use.`,
      },
    ],
    definitions: [
      { term: 'Health', meaning: 'A state of complete physical, mental and social well-being, not just the absence of disease.' },
      { term: 'Hygiene', meaning: 'Practices that keep the body and surroundings clean to prevent disease.' },
      { term: 'Pathogen', meaning: 'A microorganism (bacterium, virus, fungus or parasite) that causes disease.' },
      { term: 'Vector', meaning: 'An organism, such as a mosquito, that carries a pathogen from one host to another.' },
      { term: 'Landfill', meaning: 'A site where waste is buried in the ground.' },
      { term: 'Incineration', meaning: 'The controlled burning of waste to reduce its volume.' },
      { term: 'Recycling', meaning: 'Processing used materials so they can be made into new products.' },
    ],
    tables: [
      {
        title: 'Methods of waste disposal',
        headers: ['Method', 'Advantage', 'Disadvantage'],
        rows: [
          ['Landfill', 'Simple and cheap to run', 'Uses large areas of land; can pollute groundwater'],
          ['Incineration (burning)', 'Quickly reduces the volume of waste', 'Can pollute the air with smoke and gases'],
          ['Recycling', 'Saves raw materials and reduces landfill waste', 'Needs sorting/collection systems and can be costly'],
        ],
      },
      {
        title: 'Ways diseases are transmitted',
        headers: ['Method of spread', 'Example disease', 'A way to prevent it'],
        rows: [
          ['Contaminated food or water', 'Cholera, typhoid', 'Boil or treat drinking water; wash food well'],
          ['Airborne droplets', 'Influenza, tuberculosis', 'Cover mouth when coughing; ventilate rooms'],
          ['Direct contact', 'Ringworm, scabies', 'Avoid sharing clothes/towels; wash regularly'],
          ['Insect vectors', 'Malaria (mosquito), Bilharzia (snail)', 'Sleep under a treated mosquito net; avoid contaminated water'],
          ['Infected body fluids', 'HIV, Ebola', 'Avoid contact with infected blood; use protection'],
        ],
      },
    ],
    images: [
      {
        src: '/images/biology/personal-hygiene-icons.png',
        alt: 'Icon set showing personal hygiene habits',
        caption: 'Everyday hygiene habits: handwashing, bathing, toothbrushing and clean clothing.',
      },
      {
        src: '/images/biology/waste-disposal-methods.png',
        alt: 'Icon diagram comparing landfill, incineration and recycling',
        caption: 'Three common ways of dealing with waste: landfill, incineration and recycling.',
      },
      {
        src: '/images/biology/disease-transmission-routes.png',
        alt: 'Icon diagram of the routes by which diseases spread',
        caption: 'Diseases can spread through water, air, direct contact, insect vectors and body fluids.',
      },
    ],
    keyPoints: [
      'Good health includes physical, mental and social well-being, not just the absence of disease.',
      'Personal, food and environmental hygiene all help reduce the spread of disease.',
      'Pathogens include bacteria, viruses, fungi and parasites.',
      'Disease spreads through contaminated food/water, air, direct contact, vectors and body fluids.',
      'Waste can be dealt with by landfill, incineration or recycling, each with its own advantages and disadvantages.',
    ],
    examFocus: [
      'Describe what makes a person healthy, beyond just "not being sick."',
      'Explain the importance of personal hygiene in preventing disease.',
      'Describe how a named disease is transmitted and how to prevent it.',
      'Give an advantage and a disadvantage of a named waste-disposal method.',
    ],
  },
];

/* ---------- Helper component to render a chapter's content ---------- */
const ChapterContent: React.FC<{ chapter: Chapter }> = ({ chapter }) => {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="p-5 bg-emerald-50 rounded-xl text-slate-700 text-base leading-relaxed">
        {chapter.summary}
      </div>

      {/* Explanations */}
      {chapter.explanations.map((exp, idx) => (
        <div key={idx} className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <h4 className="text-lg font-bold text-emerald-700 mb-2">{exp.heading}</h4>
          <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
            {renderBoldText(exp.text)}
          </div>
        </div>
      ))}

      {/* Tables */}
      {chapter.tables && chapter.tables.length > 0 && (
        <div className="space-y-4">
          {chapter.tables.map((table, tIdx) => (
            <div key={tIdx} className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
              <h5 className="font-semibold text-slate-800 mb-2">{table.title}</h5>
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-emerald-50">
                    {table.headers.map((h, i) => (
                      <th key={i} className="border border-slate-300 px-4 py-2 text-left font-semibold text-slate-700">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row, rIdx) => (
                    <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="border border-slate-300 px-4 py-2 text-slate-700">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {/* Images */}
      {chapter.images && chapter.images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chapter.images.map((img, i) => (
            <div key={i} className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm text-center">
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                decoding="async"
                className="w-full rounded-lg border border-slate-100 object-contain max-h-48"
              />
              <p className="mt-2 text-sm text-slate-600">{img.caption}</p>
            </div>
          ))}
        </div>
      )}

      {/* Definitions */}
      {chapter.definitions && chapter.definitions.length > 0 && (
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <h5 className="font-semibold text-slate-800 mb-3">📖 Key Terms</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {chapter.definitions.map((def, i) => (
              <div key={i} className="bg-emerald-50 p-3 rounded-lg">
                <span className="font-bold text-emerald-800">{def.term}</span>
                <span className="text-slate-700 block text-sm mt-1">{def.meaning}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Points */}
      {chapter.keyPoints && chapter.keyPoints.length > 0 && (
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <h5 className="font-semibold text-slate-800 mb-3">✅ Key Points</h5>
          <ul className="space-y-2">
            {chapter.keyPoints.map((kp, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-700">
                <span className="inline-flex items-center justify-center bg-emerald-600 text-white rounded-full w-5 h-5 text-xs font-bold mt-0.5 shrink-0">
                  {i + 1}
                </span>
                <span>{kp}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Practicals & Exam Focus */}
      {(chapter.practicals || chapter.examFocus) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {chapter.practicals && chapter.practicals.length > 0 && (
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h5 className="font-semibold text-slate-800 mb-2">🧪 Practicals</h5>
              <ul className="list-disc list-inside text-slate-700 space-y-1">
                {chapter.practicals.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          )}
          {chapter.examFocus && chapter.examFocus.length > 0 && (
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h5 className="font-semibold text-slate-800 mb-2">📝 Exam Focus</h5>
              <ul className="list-disc list-inside text-slate-700 space-y-1">
                {chapter.examFocus.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ---------- Topic Navigation ---------- */
const TopicNav: React.FC<{ activeId: string; onNavigate: (id: string) => void; sections: { id: string; title: string }[] }> = ({
  activeId,
  onNavigate,
  sections,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - 200 : scrollLeft + 200;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-0 z-30 w-full border-b-2 border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0a0a0b]/95 py-2.5 backdrop-blur-md shadow-xs">
      <div className="w-full px-[5px] sm:px-6 md:px-8 relative flex items-center">
        <button
          onClick={() => scroll('left')}
          className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 bg-white dark:bg-[#18181b] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:translate-y-0.5 transition-all shadow-xs"
          aria-label="Scroll left"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto flex-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => onNavigate(s.id)}
              className={`shrink-0 whitespace-nowrap rounded-2xl px-4 py-2 text-xs font-black transition-all active:translate-y-0.5 ${
                activeId === s.id
                  ? 'bg-emerald-600 border-b-4 border-emerald-800 text-white shadow-sm'
                  : 'border-2 border-b-4 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1a1a1a] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
        <button
          onClick={() => scroll('right')}
          className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 bg-white dark:bg-[#18181b] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:translate-y-0.5 transition-all shadow-xs"
          aria-label="Scroll right"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
};

/* ---------- Main Biology Component ---------- */
interface BiologyProps {
  onNextTopic?: () => void;
  nextTopicTitle?: string;
}

export const Biology: React.FC<BiologyProps> = ({ onNextTopic, nextTopicTitle = 'Chemistry' }) => {
  // Build sections: first an Overview, then each chapter with full titles
  const sectionList = [
    {
      id: 'overview',
      title: 'Overview',
      content: (
        <div className="space-y-6">
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-emerald-700 mb-3">Learning Outcomes</h3>
            <ol className="list-decimal list-inside space-y-1 text-slate-700">
              <li>Cells and Levels of Organisation</li>
              <li>Nutrition</li>
              <li>Respiratory System and Air</li>
              <li>Transport Systems</li>
              <li>Reproduction in Plants and Humans</li>
              <li>Health and Diseases</li>
            </ol>
          </div>
          <div className="p-5 bg-emerald-50 rounded-xl text-slate-700">
            <p className="font-medium">Biology is the study of living things – from the smallest cell to the whole organism, how they obtain nutrients, breathe, move substances, reproduce, and stay healthy.</p>
          </div>
        </div>
      ),
    },
    ...chapters.map((ch) => ({
      id: ch.id,
      title: ch.title, // use full title
      content: <ChapterContent chapter={ch} />,
    })),
  ];

  const [active, setActive] = useState(sectionList[0].id);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [active]);
  const activeIndex = Math.max(sectionList.findIndex((s) => s.id === active), 0);
  const activeSection = sectionList[activeIndex];
  const isLast = activeIndex >= sectionList.length - 1;

  const handleNavigate = (id: string) => {
    setActive(id);
     
  };

  const handleNext = () => {
    if (!isLast) {
      setActive(sectionList[activeIndex + 1].id);
       
      return;
    }
    onNextTopic?.();
  };

  return (
    <div ref={topRef} className="min-h-screen bg-slate-50 dark:bg-[#0a0a0b] font-sans text-slate-900 dark:text-slate-100 pb-20">
      {/* Duolingo Gradient Header */}
      <header className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 border-b-4 border-emerald-900 pb-8 pt-10 text-white shadow-md">
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-black/10 blur-2xl" />

        <div className="w-full px-[5px] sm:px-6 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center rounded-2xl px-3.5 py-1 text-xs font-black tracking-wider uppercase bg-emerald-400/30 text-white border border-emerald-200/40 shadow-xs">
                BIOLOGY
              </span>
              <span className="rounded-2xl bg-white/20 px-3 py-1 text-xs font-bold text-white/90 backdrop-blur-xs">
                ZJC Form 1 • Combined Science
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-black text-white/90">
              <span className="inline-flex items-center gap-1.5 rounded-2xl bg-black/20 px-3.5 py-1.5 backdrop-blur-md border border-white/25 shadow-inner">
                🌿 {sectionList.length} Sections
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-2xl bg-black/20 px-3.5 py-1.5 backdrop-blur-md border border-white/25 shadow-inner">
                🧬 Living Systems
              </span>
            </div>
          </div>

          <h1 className="mt-4 mb-2 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-sm">
            🌿 Biology
          </h1>
          <p className="max-w-3xl text-sm sm:text-base leading-relaxed text-emerald-50 font-medium">
            Explore the building blocks of life, how organisms obtain energy, transport materials, reproduce, and maintain health.
          </p>
        </div>
      </header>

      <TopicNav
        activeId={active}
        onNavigate={handleNavigate}
        sections={sectionList.map((s) => ({ id: s.id, title: s.title }))}
      />

      <div className="w-full px-[5px] sm:px-6 md:px-8 pt-8 sm:pt-12">
        <section id={activeSection.id} className="mb-16 scroll-mt-24">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{activeSection.title}</h2>
          </div>
          <div className="prose prose-slate dark:prose-invert max-w-none">{activeSection.content}</div>
        </section>

        {/* Footer / Key Takeaways */}
        {isLast && (
          <div className="mt-12 rounded-3xl border-2 border-b-6 border-emerald-800 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6 sm:p-8 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">💡</span>
              <h3 className="font-black text-xl sm:text-2xl">Key Takeaways</h3>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 text-sm text-emerald-50 font-medium">
              <li className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/15">
                <strong className="text-white block font-bold mb-1">🔬 Cells:</strong>
                All living things are made of cells; plant and animal cells differ in structures like cell wall and chloroplasts.
              </li>
              <li className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/15">
                <strong className="text-white block font-bold mb-1">🍎 Nutrition:</strong>
                A balanced diet contains carbohydrates, proteins, fats, vitamins, minerals, fibre and water.
              </li>
              <li className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/15">
                <strong className="text-white block font-bold mb-1">🫁 Respiration:</strong>
                Air is 21% oxygen; oxygen relights a glowing splint, carbon dioxide turns limewater milky.
              </li>
              <li className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/15">
                <strong className="text-white block font-bold mb-1">🩸 Transport:</strong>
                Water moves up plants through xylem; blood contains plasma, red cells, white cells and platelets.
              </li>
              <li className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/15">
                <strong className="text-white block font-bold mb-1">🌸 Reproduction:</strong>
                Flowers have stamens and carpels; pollination leads to fertilisation; puberty brings physical changes.
              </li>
              <li className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/15">
                <strong className="text-white block font-bold mb-1">🧼 Health:</strong>
                Good health is physical, mental and social well-being; hygiene and safe waste disposal prevent disease.
              </li>
            </ul>
          </div>
        )}

        {/* Chapter Transition */}
        <div className="mt-10 rounded-3xl border-2 border-b-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18181b] p-6 sm:p-8 shadow-sm text-center">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
            {isLast ? 'Topic complete' : `Section ${activeIndex + 1} of ${sectionList.length}`}
          </p>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-6">
            {isLast ? (
              <>
                Next Section: <span className="text-emerald-600 dark:text-emerald-400">{nextTopicTitle}</span>
              </>
            ) : (
              <>
                Up Next: <span className="text-emerald-600 dark:text-emerald-400">{sectionList[activeIndex + 1].title}</span>
              </>
            )}
          </h3>
          <div className="flex items-center justify-center gap-4">
            {activeIndex > 0 && (
              <button
                type="button"
                onClick={() => handleNavigate(sectionList[activeIndex - 1].id)}
                className="rounded-2xl border-2 border-b-4 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#18181b] px-6 py-3 text-xs sm:text-sm font-black text-slate-700 dark:text-slate-200 transition-all hover:bg-slate-100 dark:hover:bg-slate-800 active:translate-y-0.5"
              >
                ← Previous Section
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              disabled={isLast && !onNextTopic}
              className="rounded-2xl border-2 border-b-4 border-emerald-800 bg-emerald-600 px-8 py-3 text-xs sm:text-sm font-black text-white shadow-md transition-all hover:bg-emerald-500 active:translate-y-0.5 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:border-slate-400 disabled:shadow-none"
            >
              {isLast ? `Begin ${nextTopicTitle} →` : 'Next Section →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Biology;