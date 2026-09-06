import type { Gender, CountryCode } from '../types/identity';

/**
 * Generates an age-appropriate, gender-accurate, and naturally styled avatar URL.
 * Solves DiceBear defaults where gender and age were previously ignored,
 * resulting in weird expressions (eating/closed eyes), elderly silver hair on young women,
 * and beards on females.
 */
export function buildRealisticAvatar(
  fullName: string,
  gender: Gender,
  age: number,
  countryCode?: CountryCode
): string {
  const isFemale = gender === 'female';
  const isSenior = age >= 55;
  const isMiddle = age >= 40 && age < 55;
  const isYouth = age <= 25;

  // 1. Hairstyles (Top) matched to Gender & Age Stage
  let topOptions: string[];
  if (isFemale) {
    if (isSenior) {
      topOptions = ['bob', 'bun', 'curly', 'curvy', 'straight01', 'straight02'];
    } else if (isYouth) {
      topOptions = [
        'bigHair',
        'bob',
        'bun',
        'curly',
        'curvy',
        'dreads',
        'fro',
        'froBand',
        'longButNotTooLong',
        'miaWallace',
        'straight01',
        'straight02',
        'straightAndStrand'
      ];
    } else {
      topOptions = [
        'bob',
        'bun',
        'curly',
        'curvy',
        'dreads',
        'fro',
        'longButNotTooLong',
        'miaWallace',
        'straight01',
        'straight02',
        'straightAndStrand'
      ];
    }
  } else {
    // Male
    if (isSenior) {
      topOptions = ['shortFlat', 'shortRound', 'shortWaved', 'theCaesar', 'theCaesarAndSidePart', 'sides'];
    } else if (isYouth) {
      topOptions = [
        'frizzle',
        'shaggy',
        'shortCurly',
        'shortFlat',
        'shortRound',
        'shortWaved',
        'theCaesar',
        'theCaesarAndSidePart'
      ];
    } else {
      topOptions = [
        'dreads01',
        'shortCurly',
        'shortFlat',
        'shortRound',
        'shortWaved',
        'theCaesar',
        'theCaesarAndSidePart'
      ];
    }
  }

  // 2. Hair Color matched strictly to Age Stage
  // 2c1b18 (black), 4a312c (dark brown), 724133 (medium brown), a55728 (auburn), b58143 (light brown), d6b370 (blonde), c93305 (red), e8e1e1 (silver/white)
  let hairColors: string[];
  const isEastAsian = ['JP', 'KR', 'HK', 'TW', 'SG', 'VN'].includes(countryCode || '');

  if (isSenior) {
    // High chance of grey/silver/salt-and-pepper hair for seniors (55+)
    hairColors = isEastAsian
      ? ['e8e1e1', 'e8e1e1', '2c1b18', '4a312c']
      : ['e8e1e1', 'e8e1e1', '724133', '4a312c', 'b58143', '2c1b18'];
  } else if (isMiddle) {
    // Natural mature colors, occasional salt-and-pepper
    hairColors = isEastAsian
      ? ['2c1b18', '2c1b18', '4a312c', 'e8e1e1']
      : ['2c1b18', '4a312c', '724133', 'a55728', 'b58143', 'd6b370', 'e8e1e1'];
  } else {
    // Youth & Adults (18-39): STRICTLY NO SILVER/GREY (no e8e1e1)!
    hairColors = isEastAsian
      ? ['2c1b18', '2c1b18', '4a312c', '724133']
      : ['2c1b18', '4a312c', '724133', 'a55728', 'b58143', 'd6b370', 'c93305'];
  }

  // 3. Clothing matched to Age Stage
  let clothingOptions: string[];
  if (isSenior) {
    clothingOptions = ['blazerAndShirt', 'blazerAndSweater', 'collarAndSweater'];
  } else if (isYouth) {
    clothingOptions = ['hoodie', 'graphicShirt', 'shirtCrewNeck', 'shirtVNeck', 'collarAndSweater'];
  } else {
    clothingOptions = [
      'blazerAndShirt',
      'blazerAndSweater',
      'collarAndSweater',
      'shirtCrewNeck',
      'shirtScoopNeck',
      'shirtVNeck'
    ];
  }

  // 4. Eyes, Mouth & Eyebrows: Filtered to pleasant, natural, professional looks
  // Excluded: closed eyes, crying, dizzy, unibrow, eating (puffed cheeks), vomit, scream
  const eyeOptions = ['default', 'happy', 'surprised', 'wink'];
  const mouthOptions = ['default', 'smile', 'twinkle'];
  const eyebrowOptions = ['defaultNatural', 'flatNatural', 'raisedExcitedNatural'];

  // 5. Glasses Accessories
  const accessoriesOptions = ['prescription01', 'prescription02', 'round', 'wayfarers'];

  const params = new URLSearchParams();
  params.set('seed', `${fullName}_${gender}_${age}`);
  params.set('top', topOptions.join(','));
  params.set('hairColor', hairColors.join(','));
  params.set('eyes', eyeOptions.join(','));
  params.set('mouth', mouthOptions.join(','));
  params.set('eyebrows', eyebrowOptions.join(','));
  params.set('clothing', clothingOptions.join(','));
  params.set('accessories', accessoriesOptions.join(','));
  params.set('accessoriesProbability', '20');

  // 6. Facial Hair (Strictly 0 for female; realistic probability for male)
  if (isFemale) {
    params.set('facialHairProbability', '0');
  } else {
    const beardProb = isSenior ? 45 : (isYouth ? 10 : 35);
    params.set('facialHairProbability', beardProb.toString());
    params.set('facialHair', ['beardLight', 'beardMedium', 'moustacheFancy'].join(','));
  }

  // 7. Skin color cultural calibration
  if (isEastAsian) {
    params.set('skinColor', ['ffdbb4', 'edb98a', 'f8d25c'].join(','));
  }

  return `https://api.dicebear.com/7.x/avataaars/svg?${params.toString()}`;
}
