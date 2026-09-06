import type { CountryCode, Gender } from '../../types/identity';

interface NameData {
  maleFirstNames: string[];
  femaleFirstNames: string[];
  lastNames: string[];
  localData?: {
    male: { kanji: string; kana: string; romaji: string }[];
    female: { kanji: string; kana: string; romaji: string }[];
    last: { kanji: string; kana: string; romaji: string }[];
  };
}

export const NAMES_BY_COUNTRY: Record<CountryCode, NameData> = {
  US: {
    maleFirstNames: ['James', 'Robert', 'John', 'Michael', 'David', 'William', 'Richard', 'Joseph', 'Thomas', 'Charles', 'Daniel', 'Matthew', 'Anthony', 'Alexander', 'Ethan'],
    femaleFirstNames: ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Emily', 'Emma', 'Olivia', 'Sophia', 'Ava'],
    lastNames: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin']
  },
  GB: {
    maleFirstNames: ['Oliver', 'George', 'Harry', 'Jack', 'Jacob', 'Noah', 'Charlie', 'Muhammad', 'Thomas', 'Oscar', 'William', 'James', 'Henry', 'Leo', 'Alfie'],
    femaleFirstNames: ['Olivia', 'Amelia', 'Isla', 'Ava', 'Emily', 'Isabella', 'Mia', 'Poppy', 'Ella', 'Lily', 'Sophia', 'Charlotte', 'Grace', 'Evie', 'Sophie'],
    lastNames: ['Smith', 'Jones', 'Taylor', 'Brown', 'Williams', 'Wilson', 'Johnson', 'Davies', 'Robinson', 'Wright', 'Thompson', 'Evans', 'Walker', 'White', 'Roberts', 'Green', 'Hall', 'Wood', 'Jackson', 'Clarke']
  },
  JP: {
    maleFirstNames: ['Ren', 'Hiroto', 'Sota', 'Yuma', 'Haruto', 'Minato', 'Riku', 'Kaito', 'Asahi', 'Taiga'],
    femaleFirstNames: ['Yui', 'Rio', 'Hina', 'Aoi', 'Rin', 'Sakura', 'Yuna', 'Mio', 'Koharu', 'Akari'],
    lastNames: ['Sato', 'Suzuki', 'Takahashi', 'Tanaka', 'Watanabe', 'Ito', 'Yamamoto', 'Nakamura', 'Kobayashi', 'Kato'],
    localData: {
      male: [
        { kanji: '蓮', kana: 'れん', romaji: 'Ren' },
        { kanji: '大翔', kana: 'ひろと', romaji: 'Hiroto' },
        { kanji: '颯真', kana: 'そうま', romaji: 'Soma' },
        { kanji: '湊', kana: 'みなと', romaji: 'Minato' },
        { kanji: '悠真', kana: 'ゆうま', romaji: 'Yuma' },
        { kanji: '健一', kana: 'けんいち', romaji: 'Kenichi' },
        { kanji: '拓也', kana: 'たくや', romaji: 'Takuya' },
        { kanji: '翔平', kana: 'しょうへい', romaji: 'Shohei' }
      ],
      female: [
        { kanji: '結菜', kana: 'ゆいな', romaji: 'Yuina' },
        { kanji: '咲良', kana: 'さくら', romaji: 'Sakura' },
        { kanji: '陽葵', kana: 'ひまり', romaji: 'Himari' },
        { kanji: '凛', kana: 'りん', romaji: 'Rin' },
        { kanji: '美咲', kana: 'みさき', romaji: 'Misaki' },
        { kanji: '七海', kana: 'ななみ', romaji: 'Nanami' },
        { kanji: '明日香', kana: 'あすか', romaji: 'Asuka' },
        { kanji: '花音', kana: 'かのん', romaji: 'Kanon' }
      ],
      last: [
        { kanji: '佐藤', kana: 'さとう', romaji: 'Sato' },
        { kanji: '鈴木', kana: 'すずき', romaji: 'Suzuki' },
        { kanji: '高橋', kana: 'たかはし', romaji: 'Takahashi' },
        { kanji: '田中', kana: 'たなか', romaji: 'Tanaka' },
        { kanji: '伊藤', kana: 'いとう', romaji: 'Ito' },
        { kanji: '渡辺', kana: 'わたなべ', romaji: 'Watanabe' },
        { kanji: '山本', kana: 'やまもと', romaji: 'Yamamoto' },
        { kanji: '中村', kana: 'なかむら', romaji: 'Nakamura' }
      ]
    }
  },
  CA: {
    maleFirstNames: ['Liam', 'Noah', 'William', 'Jack', 'Leo', 'Benjamin', 'Lucas', 'Oliver', 'Ethan', 'Jacob'],
    femaleFirstNames: ['Olivia', 'Emma', 'Charlotte', 'Amelia', 'Sophia', 'Chloe', 'Mia', 'Ava', 'Isla', 'Mila'],
    lastNames: ['Smith', 'Brown', 'Tremblay', 'Martin', 'Roy', 'Wilson', 'MacDonald', 'Gagnon', 'Johnson', 'Taylor', 'Cote', 'Bouchard']
  },
  AU: {
    maleFirstNames: ['Oliver', 'Noah', 'Jack', 'William', 'Leo', 'Lucas', 'Thomas', 'Charlie', 'Henry', 'Hudson'],
    femaleFirstNames: ['Charlotte', 'Amelia', 'Isla', 'Olivia', 'Mia', 'Ava', 'Grace', 'Willow', 'Harper', 'Hazel'],
    lastNames: ['Smith', 'Jones', 'Williams', 'Brown', 'Wilson', 'Taylor', 'Johnson', 'White', 'Martin', 'Anderson', 'Thompson', 'Nguyen']
  },
  DE: {
    maleFirstNames: ['Noah', 'Matteo', 'Leon', 'Paul', 'Luka', 'Finn', 'Elias', 'Felix', 'Maximilian', 'Jonas', 'Alexander', 'Lukas'],
    femaleFirstNames: ['Mia', 'Emma', 'Hannah', 'Sofia', 'Emilia', 'Lina', 'Ella', 'Mila', 'Clara', 'Marie', 'Lea', 'Sophie'],
    lastNames: ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann', 'Schäfer', 'Koch', 'Bauer', 'Richter', 'Klein']
  },
  FR: {
    maleFirstNames: ['Gabriel', 'Léo', 'Raphaël', 'Arthur', 'Louis', 'Jules', 'Adam', 'Maël', 'Lucas', 'Hugo', 'Noah', 'Liam'],
    femaleFirstNames: ['Jade', 'Louise', 'Ambre', 'Alba', 'Emma', 'Rose', 'Alice', 'Romy', 'Anna', 'Lina', 'Léna', 'Chloé'],
    lastNames: ['Martin', 'Bernard', 'Thomas', 'Petit', 'Robert', 'Richard', 'Durand', 'Dubois', 'Moreau', 'Laurent', 'Simon', 'Michel', 'Lefebvre', 'Leroy', 'Roux']
  },
  HK: {
    maleFirstNames: ['Ka-ho', 'Chun-kit', 'Chun-yin', 'Kin-hang', 'Man-lok', 'Tsz-hin', 'Yik-nam', 'Ho-yin', 'Wai-lun'],
    femaleFirstNames: ['Wing-yan', 'Ka-yan', 'Tsz-ching', 'Hoi-lam', 'Wing-sze', 'Sin-yi', 'Ching-man', 'Yuen-ting'],
    lastNames: ['Chan', 'Wong', 'Lee', 'Cheung', 'Leung', 'Lau', 'Ng', 'Ho', 'Lam', 'Chow', 'Mak', 'Tsang', 'Cheng'],
    localData: {
      male: [
        { kanji: '家豪', kana: 'Ka-ho', romaji: 'Ka-ho' },
        { kanji: '俊杰', kana: 'Chun-kit', romaji: 'Chun-kit' },
        { kanji: '子軒', kana: 'Tsz-hin', romaji: 'Tsz-hin' },
        { kanji: '俊彥', kana: 'Chun-yin', romaji: 'Chun-yin' },
        { kanji: '浩賢', kana: 'Ho-yin', romaji: 'Ho-yin' }
      ],
      female: [
        { kanji: '詠欣', kana: 'Wing-yan', romaji: 'Wing-yan' },
        { kanji: '嘉欣', kana: 'Ka-yan', romaji: 'Ka-yan' },
        { kanji: '芷晴', kana: 'Tsz-ching', romaji: 'Tsz-ching' },
        { kanji: '凱琳', kana: 'Hoi-lam', romaji: 'Hoi-lam' },
        { kanji: '詠思', kana: 'Wing-sze', romaji: 'Wing-sze' }
      ],
      last: [
        { kanji: '陳', kana: 'Chan', romaji: 'Chan' },
        { kanji: '黃', kana: 'Wong', romaji: 'Wong' },
        { kanji: '李', kana: 'Lee', romaji: 'Lee' },
        { kanji: '張', kana: 'Cheung', romaji: 'Cheung' },
        { kanji: '梁', kana: 'Leung', romaji: 'Leung' },
        { kanji: '何', kana: 'Ho', romaji: 'Ho' }
      ]
    }
  },
  TW: {
    maleFirstNames: ['Po-han', 'Guan-yu', 'Chia-hao', 'Yu-ting', 'Chun-chieh', 'Yu-xiang', 'Cheng-han', 'Kuan-yu'],
    femaleFirstNames: ['Ting-yu', 'Ya-ting', 'Yu-ting', 'Chia-chen', 'Pei-chen', 'Yi-hsuan', 'Hsin-yu', 'Yi-ting'],
    lastNames: ['Chen', 'Lin', 'Huang', 'Chang', 'Li', 'Wang', 'Wu', 'Liu', 'Tsai', 'Yang', 'Hsu', 'Cheng'],
    localData: {
      male: [
        { kanji: '柏翰', kana: 'Po-han', romaji: 'Po-han' },
        { kanji: '冠宇', kana: 'Guan-yu', romaji: 'Guan-yu' },
        { kanji: '家豪', kana: 'Chia-hao', romaji: 'Chia-hao' },
        { kanji: '承翰', kana: 'Cheng-han', romaji: 'Cheng-han' },
        { kanji: '俊傑', kana: 'Chun-chieh', romaji: 'Chun-chieh' }
      ],
      female: [
        { kanji: '婷鈺', kana: 'Ting-yu', romaji: 'Ting-yu' },
        { kanji: '雅婷', kana: 'Ya-ting', romaji: 'Ya-ting' },
        { kanji: '佳蓁', kana: 'Chia-chen', romaji: 'Chia-chen' },
        { kanji: '珮甄', kana: 'Pei-chen', romaji: 'Pei-chen' },
        { kanji: '欣妤', kana: 'Hsin-yu', romaji: 'Hsin-yu' }
      ],
      last: [
        { kanji: '陳', kana: 'Chen', romaji: 'Chen' },
        { kanji: '林', kana: 'Lin', romaji: 'Lin' },
        { kanji: '黃', kana: 'Huang', romaji: 'Huang' },
        { kanji: '張', kana: 'Chang', romaji: 'Chang' },
        { kanji: '李', kana: 'Li', romaji: 'Li' },
        { kanji: '蔡', kana: 'Tsai', romaji: 'Tsai' }
      ]
    }
  },
  SG: {
    maleFirstNames: ['Wei Ming', 'Jun Hao', 'Daryl', 'Ryan', 'Justin', 'Aaron', 'Marcus', 'Bryan', 'Muhammad', 'Ahmad'],
    femaleFirstNames: ['Xin Yi', 'Jia Ying', 'Rachel', 'Nicole', 'Cheryl', 'Jessica', 'Vanessa', 'Nurul', 'Farah', 'Siti'],
    lastNames: ['Tan', 'Lim', 'Lee', 'Ng', 'Ong', 'Wong', 'Goh', 'Chua', 'Chan', 'Koh', 'Teo', 'Mohamed', 'Kumar']
  },
  KR: {
    maleFirstNames: ['Min-jun', 'Seo-jun', 'Do-yun', 'Ye-jun', 'Si-woo', 'Ha-jun', 'Ji-ho', 'Ji-hu', 'Jun-seo'],
    femaleFirstNames: ['Seo-yeon', 'Seo-yun', 'Ji-woo', 'Seo-hyeon', 'Ha-eun', 'Ha-yoon', 'Min-seo', 'Ji-a', 'Chae-won'],
    lastNames: ['Kim', 'Lee', 'Park', 'Choi', 'Jung', 'Kang', 'Cho', 'Yoon', 'Jang', 'Lim', 'Han', 'Oh'],
    localData: {
      male: [
        { kanji: '민준', kana: 'Min-jun', romaji: 'Min-jun' },
        { kanji: '서준', kana: 'Seo-jun', romaji: 'Seo-jun' },
        { kanji: '도윤', kana: 'Do-yun', romaji: 'Do-yun' },
        { kanji: '하준', kana: 'Ha-jun', romaji: 'Ha-jun' },
        { kanji: '지호', kana: 'Ji-ho', romaji: 'Ji-ho' }
      ],
      female: [
        { kanji: '서연', kana: 'Seo-yeon', romaji: 'Seo-yeon' },
        { kanji: '지우', kana: 'Ji-woo', romaji: 'Ji-woo' },
        { kanji: '하은', kana: 'Ha-eun', romaji: 'Ha-eun' },
        { kanji: '서현', kana: 'Seo-hyeon', romaji: 'Seo-hyeon' },
        { kanji: '채원', kana: 'Chae-won', romaji: 'Chae-won' }
      ],
      last: [
        { kanji: '김', kana: 'Kim', romaji: 'Kim' },
        { kanji: '이', kana: 'Lee', romaji: 'Lee' },
        { kanji: '박', kana: 'Park', romaji: 'Park' },
        { kanji: '최', kana: 'Choi', romaji: 'Choi' },
        { kanji: '정', kana: 'Jung', romaji: 'Jung' }
      ]
    }
  },
  CH: {
    maleFirstNames: ['Noah', 'Liam', 'Matteo', 'Leon', 'Luca', 'Gabriel', 'Elias', 'Louis', 'Julian'],
    femaleFirstNames: ['Mia', 'Emma', 'Mila', 'Elena', 'Sofia', 'Emilia', 'Anna', 'Lina', 'Laura'],
    lastNames: ['Müller', 'Meier', 'Schmid', 'Keller', 'Weber', 'Huber', 'Schneider', 'Meyer', 'Steiner', 'Fischer']
  },
  LU: {
    maleFirstNames: ['Noah', 'Liam', 'Gabriel', 'Leo', 'Arthur', 'Louis', 'Luca', 'Felix'],
    femaleFirstNames: ['Emma', 'Mia', 'Sophie', 'Olivia', 'Chloe', 'Alice', 'Charlotte', 'Lea'],
    lastNames: ['Schmit', 'Muller', 'Weber', 'Hoffmann', 'Wagner', 'Faber', 'Thill', 'Kieffer']
  },
  IE: {
    maleFirstNames: ['Jack', 'James', 'Noah', 'Daniel', 'Conor', 'Finn', 'Liam', 'Fionn', 'Alex', 'Charlie'],
    femaleFirstNames: ['Emily', 'Grace', 'Fiadh', 'Sophie', 'Hannah', 'Amelia', 'Ava', 'Isla', 'Freya'],
    lastNames: ['Murphy', 'Kelly', 'O\'Brien', 'Ryan', 'O\'Connor', 'Walsh', 'O\'Sullivan', 'McCarthy', 'Doyle']
  },
  IT: {
    maleFirstNames: ['Leonardo', 'Francesco', 'Alessandro', 'Lorenzo', 'Mattia', 'Andrea', 'Gabriele', 'Riccardo', 'Tommaso'],
    femaleFirstNames: ['Sofia', 'Aurora', 'Giulia', 'Ginevra', 'Beatrice', 'Alice', 'Vittoria', 'Emma', 'Giorgia'],
    lastNames: ['Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco']
  },
  ES: {
    maleFirstNames: ['Hugo', 'Mateo', 'Martin', 'Lucas', 'Leo', 'Daniel', 'Alejandro', 'Manuel', 'Pablo', 'Alvaro'],
    femaleFirstNames: ['Lucia', 'Sofia', 'Martina', 'Valeria', 'Maria', 'Julia', 'Paula', 'Emma', 'Daniela'],
    lastNames: ['Garcia', 'Rodriguez', 'Gonzalez', 'Fernandez', 'Lopez', 'Martinez', 'Sanchez', 'Perez', 'Gomez']
  },
  NL: {
    maleFirstNames: ['Noah', 'Sem', 'Lucas', 'Daan', 'Finn', 'Levi', 'Liam', 'James', 'Milan', 'Mees'],
    femaleFirstNames: ['Emma', 'Julia', 'Mila', 'Tess', 'Sophie', 'Zoe', 'Sara', 'Nora', 'Yara', 'Liv'],
    lastNames: ['De Jong', 'Jansen', 'De Vries', 'Van de Berg', 'Van Dijk', 'Bakker', 'Janssen', 'Visser', 'Smit']
  },
  MY: {
    maleFirstNames: ['Ahmad', 'Muhammad', 'Hafiz', 'Wei Lun', 'Daniel', 'Amirul', 'Kumar', 'Zul', 'Farhan'],
    femaleFirstNames: ['Nurul', 'Siti', 'Aina', 'Mei Ling', 'Sarah', 'Farah', 'Priya', 'Nadia', 'Anis'],
    lastNames: ['Abdullah', 'Tan', 'Lim', 'Lee', 'Mohamed', 'Wong', 'Othman', 'Ramasamy', 'Chua', 'Ismail']
  },
  TH: {
    maleFirstNames: ['Somchai', 'Kittisak', 'Arthit', 'Chaiwat', 'Natthan', 'Thanawat', 'Prasert', 'Worawut'],
    femaleFirstNames: ['Siriporn', 'Kanya', 'Supaporn', 'Nonglak', 'Ploy', 'Kannika', 'Wanida', 'Chutima'],
    lastNames: ['Saetang', 'Suksawat', 'Rattanakul', 'Charoensuk', 'Wongsuwan', 'Panyarachun', 'Thanasuk']
  },
  VN: {
    maleFirstNames: ['Duc Minh', 'Tuan Anh', 'Hoang Nam', 'Quoc Bao', 'Gia Huy', 'Thanh Tung', 'Huu Thang'],
    femaleFirstNames: ['Thu Ha', 'Mai Anh', 'Ngoc Anh', 'Thao My', 'Bao Ngoc', 'Khanh Linh', 'Phuong Thao'],
    lastNames: ['Nguyen', 'Tran', 'Le', 'Pham', 'Hoang', 'Phan', 'Vu', 'Dang', 'Bui', 'Do', 'Ho']
  },
  PH: {
    maleFirstNames: ['Joshua', 'Angelo', 'Christian', 'Gabriel', 'Mark', 'John Paul', 'Nathaniel', 'Daniel'],
    femaleFirstNames: ['Princess', 'Angel', 'Mary Joy', 'Jasmine', 'Samantha', 'Nicole', 'Bea', 'Chloe'],
    lastNames: ['Santos', 'Reyes', 'Cruz', 'Bautista', 'Ocampo', 'Garcia', 'Mendoza', 'Torres', 'Tomas']
  }
};

const KR_HANZI_MAP: Record<string, string> = {
  '김': '金', '이': '李', '박': '朴', '최': '崔', '정': '郑',
  '민준': '敏俊', '서준': '瑞俊', '도윤': '道润', '하준': '夏俊', '지호': '志浩',
  '서연': '瑞妍', '지우': '智友', '하은': '夏恩', '서현': '徐贤', '채원': '彩元'
};

const FIRST_NAME_ZH: Record<string, string> = {
  // First names - Male
  'James': '詹姆斯', 'Robert': '罗伯特', 'John': '约翰', 'Michael': '迈克尔', 'David': '大卫',
  'William': '威廉', 'Richard': '理查德', 'Joseph': '约瑟夫', 'Thomas': '托马斯', 'Charles': '查尔斯',
  'Daniel': '丹尼尔', 'Matthew': '马修', 'Anthony': '安东尼', 'Alexander': '亚历山大', 'Ethan': '伊森',
  'Oliver': '奥利弗', 'George': '乔治', 'Harry': '哈利', 'Jack': '杰克', 'Jacob': '雅各布',
  'Noah': '诺亚', 'Charlie': '查理', 'Muhammad': '穆罕默德', 'Oscar': '奥斯卡', 'Henry': '亨利',
  'Leo': '里奥', 'Alfie': '阿尔菲', 'Liam': '利亚姆', 'Benjamin': '本杰明', 'Lucas': '卢卡斯',
  'Hudson': '哈德逊', 'Matteo': '马特奥', 'Leon': '莱昂', 'Paul': '保罗', 'Luka': '卢卡',
  'Finn': '芬恩', 'Elias': '埃利亚斯', 'Felix': '菲利克斯', 'Maximilian': '马克西米利安', 'Jonas': '乔纳斯',
  'Lukas': '卢卡斯', 'Gabriel': '加布里埃尔', 'Léo': '莱奥', 'Raphaël': '拉斐尔', 'Arthur': '亚瑟',
  'Louis': '路易', 'Jules': '朱尔斯', 'Adam': '亚当', 'Maël': '马埃尔', 'Hugo': '雨果',
  'Conor': '康纳', 'Fionn': '芬恩', 'Alex': '亚历克斯', 'Leonardo': '莱昂纳多', 'Francesco': '弗朗西斯科',
  'Alessandro': '亚历山德罗', 'Lorenzo': '洛伦佐', 'Mattia': '马蒂亚', 'Andrea': '安德烈', 'Gabriele': '加布里埃莱',
  'Riccardo': '里卡多', 'Tommaso': '托马索', 'Mateo': '马特奥', 'Martin': '马丁', 'Alejandro': '亚历杭德罗',
  'Manuel': '曼努埃尔', 'Pablo': '帕布罗', 'Alvaro': '阿尔瓦罗', 'Sem': '塞姆', 'Daan': '达安',
  'Levi': '利维', 'Milan': '米兰', 'Mees': '梅斯', 'Wei Ming': '伟明', 'Jun Hao': '俊豪',
  'Daryl': '达里尔', 'Ryan': '瑞恩', 'Justin': '贾斯汀', 'Aaron': '亚伦', 'Marcus': '马库斯',
  'Bryan': '布莱恩', 'Ahmad': '艾哈迈德', 'Hafiz': '哈菲兹', 'Wei Lun': '伟伦', 'Amirul': '阿米鲁尔',
  'Kumar': '库马尔', 'Zul': '祖尔', 'Farhan': '法尔汉', 'Somchai': '颂猜', 'Kittisak': '吉滴萨',
  'Arthit': '阿铁', 'Chaiwat': '猜瓦', 'Natthan': '纳塔', 'Thanawat': '塔纳瓦', 'Prasert': '巴瑟',
  'Worawut': '沃拉武', 'Duc Minh': '德明', 'Tuan Anh': '俊英', 'Hoang Nam': '皇男', 'Quoc Bao': '国宝',
  'Gia Huy': '嘉辉', 'Thanh Tung': '青松', 'Huu Thang': '友胜', 'Joshua': '约书亚', 'Angelo': '安吉洛',
  'Christian': '克里斯蒂安', 'Mark': '马克', 'John Paul': '约翰·保罗', 'Nathaniel': '纳撒尼尔',

  // First names - Female
  'Mary': '玛丽', 'Patricia': '帕特里夏', 'Jennifer': '珍妮弗', 'Linda': '琳达', 'Elizabeth': '伊丽莎白',
  'Barbara': '芭芭拉', 'Susan': '苏珊', 'Jessica': '杰西卡', 'Sarah': '莎拉', 'Karen': '凯伦',
  'Emily': '艾米莉', 'Emma': '艾玛', 'Olivia': '奥利维亚', 'Sophia': '索菲亚', 'Ava': '艾娃',
  'Amelia': '阿米莉亚', 'Isla': '艾拉', 'Isabella': '伊莎贝拉', 'Mia': '米娅', 'Poppy': '波比',
  'Ella': '艾拉', 'Lily': '莉莉', 'Charlotte': '夏洛特', 'Grace': '格蕾丝', 'Evie': '伊芙',
  'Sophie': '索菲', 'Chloe': '克洛伊', 'Mila': '米拉', 'Willow': '薇洛', 'Harper': '哈珀',
  'Hazel': '黑兹尔', 'Hannah': '汉娜', 'Sofia': '索菲亚', 'Emilia': '艾米莉亚', 'Lina': '丽娜',
  'Clara': '克拉拉', 'Marie': '玛丽', 'Lea': '蕾雅', 'Jade': '杰德', 'Louise': '路易丝',
  'Ambre': '安布尔', 'Alba': '阿尔巴', 'Rose': '罗斯', 'Alice': '爱丽丝', 'Romy': '罗米',
  'Anna': '安娜', 'Léna': '莱娜', 'Chloé': '克洛伊', 'Fiadh': '菲娅', 'Freya': '芙蕾雅',
  'Aurora': '奥罗拉', 'Giulia': '茱莉亚', 'Ginevra': '吉内芙拉', 'Beatrice': '比阿特丽斯', 'Vittoria': '维多利亚',
  'Giorgia': '乔治亚', 'Lucia': '露西亚', 'Martina': '玛蒂娜', 'Valeria': '瓦莱丽亚', 'Maria': '玛丽亚',
  'Julia': '胡利娅', 'Paula': '宝拉', 'Daniela': '丹妮埃拉', 'Tess': '苔丝', 'Zoe': '佐伊',
  'Sara': '萨拉', 'Nora': '诺拉', 'Yara': '雅拉', 'Liv': '丽芙', 'Xin Yi': '心怡',
  'Jia Ying': '嘉莹', 'Rachel': '瑞秋', 'Nicole': '妮可', 'Cheryl': '谢丽尔', 'Vanessa': '瓦妮莎',
  'Nurul': '努鲁尔', 'Farah': '法拉', 'Siti': '西蒂', 'Aina': '艾娜', 'Mei Ling': '美玲',
  'Priya': '普里亚', 'Nadia': '纳迪亚', 'Anis': '阿尼斯', 'Siriporn': '西里蓬', 'Kanya': '干雅',
  'Supaporn': '素帕蓬', 'Nonglak': '农乐', 'Ploy': '普洛伊', 'Kannika': '干妮卡', 'Wanida': '瓦妮达',
  'Chutima': '楚蒂玛', 'Thu Ha': '秋河', 'Mai Anh': '梅英', 'Ngoc Anh': '玉英', 'Thao My': '草薇',
  'Bao Ngoc': '宝玉', 'Khanh Linh': '庆玲', 'Phuong Thao': '芳草', 'Princess': '普琳赛斯', 'Angel': '安吉尔',
  'Mary Joy': '玛丽·乔伊', 'Jasmine': '茉莉', 'Samantha': '萨曼莎', 'Bea': '碧雅'
};

const LAST_NAME_ZH: Record<string, string> = {
  // Surnames
  'Smith': '史密斯', 'Johnson': '约翰逊', 'Williams': '威廉姆斯', 'Brown': '布朗', 'Jones': '琼斯',
  'Garcia': '加西亚', 'Miller': '米勒', 'Davis': '戴维斯', 'Rodriguez': '罗德里格斯', 'Martinez': '马丁内斯',
  'Hernandez': '埃尔南德斯', 'Lopez': '洛佩斯', 'Gonzalez': '冈萨雷斯', 'Wilson': '威尔逊', 'Anderson': '安德森',
  'Thomas': '托马斯', 'Taylor': '泰勒', 'Moore': '摩尔', 'Jackson': '杰克逊', 'Martin': '马丁',
  'Davies': '戴维斯', 'Robinson': '罗宾逊', 'Wright': '赖特', 'Thompson': '汤普森', 'Evans': '埃尔文斯',
  'Walker': '沃克', 'White': '怀特', 'Roberts': '罗伯茨', 'Green': '格林', 'Hall': '霍尔',
  'Wood': '伍德', 'Clarke': '克拉克', 'Tremblay': '特朗布莱', 'Roy': '罗伊', 'MacDonald': '麦克唐纳',
  'Gagnon': '加尼翁', 'Cote': '科特', 'Bouchard': '布夏尔', 'Müller': '穆勒', 'Schmidt': '施密特',
  'Schneider': '施耐德', 'Fischer': '费舍尔', 'Weber': '韦伯', 'Meyer': '迈尔', 'Wagner': '瓦格纳',
  'Becker': '贝克尔', 'Schulz': '舒尔茨', 'Hoffmann': '霍夫曼', 'Schäfer': '舍费尔', 'Koch': '科赫',
  'Bauer': '鲍尔', 'Richter': '里希特', 'Klein': '克莱因', 'Bernard': '贝尔纳', 'Petit': '佩蒂',
  'Robert': '罗贝尔', 'Richard': '里夏尔', 'Durand': '杜兰', 'Dubois': '杜布瓦', 'Moreau': '莫罗',
  'Laurent': '洛朗', 'Simon': '西蒙', 'Michel': '米歇尔', 'Lefebvre': '勒费弗尔', 'Leroy': '勒鲁瓦',
  'Roux': '鲁', 'Meier': '迈尔', 'Schmid': '施密德', 'Keller': '凯勒', 'Huber': '胡贝尔',
  'Steiner': '施泰纳', 'Schmit': '施密特', 'Muller': '穆勒', 'Faber': '法贝尔', 'Thill': '蒂尔',
  'Kieffer': '基弗', 'Murphy': '墨菲', 'Kelly': '凯利', "O'Brien": '奥布莱恩', 'Ryan': '瑞安',
  "O'Connor": '奥康纳', 'Walsh': '沃尔什', "O'Sullivan": '奥沙利文', 'McCarthy': '麦卡锡', 'Doyle': '多伊尔',
  'Rossi': '罗西', 'Russo': '鲁索', 'Ferrari': '法拉利', 'Esposito': '埃斯波西托', 'Bianchi': '比安奇',
  'Romano': '罗马诺', 'Colombo': '科隆博', 'Ricci': '里奇', 'Marino': '马里诺', 'Greco': '格雷科',
  'Fernandez': '费尔南德斯', 'Sanchez': '桑切斯', 'Perez': '佩雷斯', 'Gomez': '戈麦斯', 'De Jong': '德容',
  'Jansen': '扬森', 'De Vries': '德弗里斯', 'Van de Berg': '范登贝赫', 'Van Dijk': '范戴克', 'Bakker': '巴克',
  'Janssen': '扬森', 'Visser': '费瑟', 'Smit': '斯密特', 'Tan': '陈', 'Lim': '林',
  'Lee': '李', 'Ng': '黄', 'Ong': '王', 'Wong': '黄', 'Goh': '吴',
  'Chua': '蔡', 'Chan': '陈', 'Koh': '许', 'Teo': '张', 'Mohamed': '穆罕默德',
  'Abdullah': '阿卜杜拉', 'Othman': '奥斯曼', 'Ramasamy': '拉马萨米', 'Ismail': '伊斯梅尔', 'Saetang': '蔡',
  'Suksawat': '素沙瓦', 'Rattanakul': '拉塔纳库', 'Charoensuk': '乍仑素', 'Wongsuwan': '翁素万', 'Panyarachun': '班耶拉春',
  'Thanasuk': '塔纳素', 'Nguyen': '阮', 'Tran': '陈', 'Le': '黎', 'Pham': '范',
  'Hoang': '黄', 'Phan': '潘', 'Vu': '武', 'Dang': '邓', 'Bui': '裴',
  'Do': '杜', 'Ho': '何', 'Santos': '桑托斯', 'Reyes': '雷耶斯', 'Cruz': '克鲁兹',
  'Bautista': '包蒂斯塔', 'Ocampo': '奥坎波', 'Mendoza': '门多萨', 'Torres': '托雷斯', 'Tomas': '托马斯'
};

export interface CountryLocalMeta {
  code: CountryCode;
  langLabel: string;
  countryLocalName: string;
  langCode: string;
}

export const COUNTRY_LOCAL_META: Record<CountryCode, CountryLocalMeta> = {
  US: { code: 'US', langLabel: 'English', countryLocalName: 'United States', langCode: 'en' },
  GB: { code: 'GB', langLabel: 'English', countryLocalName: 'United Kingdom', langCode: 'en' },
  JP: { code: 'JP', langLabel: '日本語', countryLocalName: '日本', langCode: 'ja' },
  CA: { code: 'CA', langLabel: 'English', countryLocalName: 'Canada', langCode: 'en' },
  AU: { code: 'AU', langLabel: 'English', countryLocalName: 'Australia', langCode: 'en' },
  DE: { code: 'DE', langLabel: 'Deutsch', countryLocalName: 'Deutschland', langCode: 'de' },
  FR: { code: 'FR', langLabel: 'Français', countryLocalName: 'France', langCode: 'fr' },
  HK: { code: 'HK', langLabel: '繁體中文', countryLocalName: '香港', langCode: 'zh-HK' },
  TW: { code: 'TW', langLabel: '繁體中文', countryLocalName: '台灣', langCode: 'zh-TW' },
  SG: { code: 'SG', langLabel: 'English', countryLocalName: 'Singapore', langCode: 'en' },
  KR: { code: 'KR', langLabel: '한국어', countryLocalName: '대한민국', langCode: 'ko' },
  CH: { code: 'CH', langLabel: 'Deutsch', countryLocalName: 'Schweiz', langCode: 'de' },
  LU: { code: 'LU', langLabel: 'Français', countryLocalName: 'Luxembourg', langCode: 'fr' },
  IE: { code: 'IE', langLabel: 'English', countryLocalName: 'Ireland', langCode: 'en' },
  IT: { code: 'IT', langLabel: 'Italiano', countryLocalName: 'Italia', langCode: 'it' },
  ES: { code: 'ES', langLabel: 'Español', countryLocalName: 'España', langCode: 'es' },
  NL: { code: 'NL', langLabel: 'Nederlands', countryLocalName: 'Nederland', langCode: 'nl' },
  MY: { code: 'MY', langLabel: 'Melayu', countryLocalName: 'Malaysia', langCode: 'ms' },
  TH: { code: 'TH', langLabel: 'ไทย', countryLocalName: 'ประเทศไทย', langCode: 'th' },
  VN: { code: 'VN', langLabel: 'Tiếng Việt', countryLocalName: 'Việt Nam', langCode: 'vi' },
  PH: { code: 'PH', langLabel: 'Filipino', countryLocalName: 'Pilipinas', langCode: 'fil' }
};

export function getRandomName(countryCode: CountryCode, gender: Gender) {
  const data = NAMES_BY_COUNTRY[countryCode] || NAMES_BY_COUNTRY.US;

  if (countryCode === 'JP' && data.localData) {
    const list = gender === 'male' ? data.localData.male : data.localData.female;
    const firstItem = list[Math.floor(Math.random() * list.length)];
    const lastItem = data.localData.last[Math.floor(Math.random() * data.localData.last.length)];
    return {
      firstName: firstItem.romaji,
      lastName: lastItem.romaji,
      fullName: `${firstItem.romaji} ${lastItem.romaji}`,
      localFullName: `${lastItem.kanji} ${firstItem.kanji}`,
      phoneticName: `${lastItem.kana} ${firstItem.kana}`,
      zhFullName: `${lastItem.kanji}${firstItem.kanji}`
    };
  }

  if (countryCode === 'KR' && data.localData) {
    const list = gender === 'male' ? data.localData.male : data.localData.female;
    const firstItem = list[Math.floor(Math.random() * list.length)];
    const lastItem = data.localData.last[Math.floor(Math.random() * data.localData.last.length)];
    const lastHanzi = KR_HANZI_MAP[lastItem.kanji] || lastItem.kanji;
    const firstHanzi = KR_HANZI_MAP[firstItem.kanji] || firstItem.kanji;
    return {
      firstName: firstItem.romaji,
      lastName: lastItem.romaji,
      fullName: `${lastItem.romaji} ${firstItem.romaji}`,
      localFullName: `${lastItem.kanji}${firstItem.kanji}`,
      phoneticName: `${lastItem.romaji} ${firstItem.romaji}`,
      zhFullName: `${lastHanzi}${firstHanzi}`
    };
  }

  if ((countryCode === 'HK' || countryCode === 'TW') && data.localData) {
    const list = gender === 'male' ? data.localData.male : data.localData.female;
    const firstItem = list[Math.floor(Math.random() * list.length)];
    const lastItem = data.localData.last[Math.floor(Math.random() * data.localData.last.length)];
    return {
      firstName: firstItem.romaji,
      lastName: lastItem.romaji,
      fullName: `${firstItem.romaji} ${lastItem.romaji}`,
      localFullName: `${lastItem.kanji}${firstItem.kanji}`,
      phoneticName: `${lastItem.romaji} ${firstItem.romaji}`,
      zhFullName: `${lastItem.kanji}${firstItem.kanji}`
    };
  }

  const firstPool = gender === 'male' ? data.maleFirstNames : data.femaleFirstNames;
  const firstName = firstPool[Math.floor(Math.random() * firstPool.length)];
  const lastName = data.lastNames[Math.floor(Math.random() * data.lastNames.length)];
  const fullName = `${firstName} ${lastName}`;

  // Chinese transliteration if mapped
  const firstZh = FIRST_NAME_ZH[firstName];
  const lastZh = LAST_NAME_ZH[lastName];
  let zhFullName: string | undefined;
  if (firstZh && lastZh) {
    zhFullName = `${firstZh}·${lastZh}`;
  } else if (firstZh) {
    zhFullName = `${firstZh} ${lastName}`;
  } else if (lastZh) {
    zhFullName = `${firstName}·${lastZh}`;
  }

  return {
    firstName,
    lastName,
    fullName,
    localFullName: fullName,
    zhFullName
  };
}
