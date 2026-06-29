import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import { ArrowRightIcon, CheckIcon, ServiceIcon, type ServiceIconName } from '../../components/Icons';
import { SITE_URL } from '../../lib/site';

type ServiceData = {
  slug: string;
  title: string;
  subtitle: string;
  color: string;
  icon: ServiceIconName;
  heroText: string;
  intro?: string[];
  forWhom: string[];
  whatYouGet: string[];
  process?: { title: string; text: string }[];
  pricing: { name: string; price: string; items: string[] }[];
  pricingNote?: string;
  extras?: string[];
  faq?: { q: string; a: string }[];
};

const servicesData: Record<string, ServiceData> = {
  'cold-email': {
    slug: 'cold-email',
    title: 'Cold Email kampane',
    subtitle: 'B2B outreach na autopilote',
    color: '#7c9cff',
    icon: 'mail',
    heroText: 'Cielené oslovovanie decision makerov bez závislosti od algoritmov. Postavíme techniku, databázu aj sekvencie tak, aby z kampane chodili reálne odpovede a stretnutia.',
    intro: [
      'Cold emailing je priame oslovovanie firiem alebo ľudí, s ktorými ste doteraz neboli v kontakte. Namiesto čakania, či si vás niekto všimne v reklame, idete priamo za relevantným publikom podľa segmentu, lokality alebo veľkosti firmy.',
      'Výsledkom nie sú len impresie a kliky, ale konkrétne reakcie, dopyty a obchodné príležitosti. Celý technický setup, zohriatie emailov, databázu kontaktov aj samotné sekvencie pripravíme a priebežne optimalizujeme za vás.',
    ],
    forWhom: [
      'B2B firmy, ktoré chcú stabilný prísun nových leadov',
      'Agentúry, konzultanti a freelanceri predávajúci služby firmám',
      'SaaS a technologické firmy s outbound predajom',
      'Výrobné firmy a distribútori hľadajúci nových partnerov',
      'Recruiting a HR firmy oslovujúce firmy alebo kandidátov',
    ],
    whatYouGet: [
      'Nákup domén, vytvorenie emailových schránok a ich napojenie na výkonové servery',
      'Postupné warm-upovanie emailov pre lepšiu doručiteľnosť',
      'Databázu relevantných kontaktov podľa segmentu, lokality a veľkosti firmy',
      'Overenie emailových adries validačným nástrojom',
      'Napísanie emailových sekvencií a kompletné načasovanie kampane',
      'Odosielanie kampane cez vlastné servery a dohľad nad deliverability',
      'Mesačný report s prehľadom odpovedí, doručenia a odporúčaniami na zlepšenie',
    ],
    process: [
      {
        title: 'Technický setup',
        text: 'Pripravíme domény, schránky, servery a bezpečne rozbehneme warm-up, aby emaily neskončili v spame.',
      },
      {
        title: 'Obsah a databáza',
        text: 'Vyberieme cieľový segment, pripravíme databázu kontaktov a napíšeme sekvencie podľa vášho produktu a cieľa.',
      },
      {
        title: 'Spustenie kampane',
        text: 'Kampaň rozosielame priebežne a kontrolovane, odpovede chodia priamo na vašu vybranú schránku.',
      },
      {
        title: 'Report a optimalizácia',
        text: 'Sledujeme výsledky, upravujeme kampane podľa dát a odporúčame ďalšie kroky na zvýšenie reply rate.',
      },
    ],
    pricing: [
      {
        name: 'MINI',
        price: '300 € setup + 100 €/mes',
        items: [
          '1 doména a 3 emailové účty',
          '1 sekvencia',
          'max. 75 oslovených firiem denne',
          'databáza do 2 000 kontaktov',
          'overenie do 2 000 emailov mesačne',
          'základný report',
        ],
      },
      {
        name: 'OPTIMAL',
        price: '600 € setup + 200 €/mes',
        items: [
          '5 domén a 15 emailových účtov',
          '2 sekvencie a 1 segment databázy',
          'max. 375 oslovených firiem denne',
          'databáza do 10 000 kontaktov',
          'overenie do 10 000 emailov mesačne',
          'priebežná optimalizácia a rozšírený report',
        ],
      },
      {
        name: 'POWER',
        price: '800 € setup + 300 €/mes',
        items: [
          '10 domén a 30 emailových účtov',
          '4 sekvencie a 2 segmenty databázy',
          'max. 750 oslovených firiem denne',
          'databáza do 20 000 kontaktov',
          'A/B testovanie a priebežná optimalizácia',
          'rozšírený report a škálovanie kampaní',
        ],
      },
    ],
    pricingNote: 'Odporúčaná dĺžka spolupráce je aspoň 2 mesiace. Pri spolupráci na 3 a viac mesiacov je zľava 10 % z mesačnej správy.',
    faq: [
      {
        q: 'Ako rýchlo sa kampaň spustí?',
        a: 'Prvé 2 až 3 týždne sú venované technickému nastaveniu a warm-upu emailov. Následne sa rozbieha hlavná rozosielacia fáza.',
      },
      {
        q: 'Komu chodia odpovede z kampane?',
        a: 'Záujemcovia odpovedajú priamo na vašu vybranú emailovú schránku, takže máte okamžitý prehľad o reakciách.',
      },
      {
        q: 'Viete databázu pripraviť aj pre zahraničie?',
        a: 'Áno. Databázy pripravujeme pre slovenské aj zahraničné trhy podľa segmentu, lokality a typu firmy.',
      },
    ],
  },
  seo: {
    slug: 'seo',
    title: 'SEO obsah & Link building',
    subtitle: 'Organická viditeľnosť, ktorá rastie',
    color: '#53b8d9',
    icon: 'seo',
    heroText: 'SEO, ktoré stojí na dátach, nie na dojmoch. Pomôžeme vám opraviť chyby na webe, nájsť správne kľúčové slová a posilniť autoritu cez kvalitné odkazy.',
    intro: [
      'Google je miesto, kde zákazníci aktívne hľadajú riešenie svojho problému. Ak ste tam neviditeľní, prichádzate o dopyty, ktoré už na trhu existujú. SEO nie je jednorazový trik, ale systematická práca na tom, aby bol web technicky v poriadku, obsahovo silný a dôveryhodný.',
      'Začíname analýzou aktuálneho stavu, identifikáciou najväčších problémov a odporúčaniami, ktoré majú reálny dopad. Následne vieme riešiť kľúčové slová, obsah, linkbuilding aj prepojenie so Search Console a analytikou.',
    ],
    forWhom: [
      'Firmy a e-shopy, ktoré chcú získavať viac dopytov z Googlu',
      'Weby so slabou organickou viditeľnosťou alebo neporiadkom v štruktúre',
      'Značky, ktoré chcú znížiť závislosť od platenej reklamy',
      'Firmy vstupujúce do nových kategórií alebo na nové trhy',
    ],
    whatYouGet: [
      'Základnú alebo rozšírenú SEO analýzu webu',
      'Zoznam najväčších SEO chýb a priorít na opravu',
      'Analýzu kľúčových slov a odporúčania pre štruktúru webu',
      'Analýzu konkurencie a konkrétne tipy, kde vás predbiehajú',
      'On-page odporúčania pre texty, nadpisy, meta dáta a interné prelinkovanie',
      'Linkbuilding návrh a budovanie kvalitných spätných odkazov',
      'Monitoring cez Google Search Console a Analytics',
    ],
    process: [
      {
        title: 'Audit a priority',
        text: 'Najprv zistíme, kde web stráca výkon a ktoré SEO chyby brzdia rast najviac.',
      },
      {
        title: 'Kľúčové slová a konkurencia',
        text: 'Nájdeme frázy, ktoré ľudia reálne hľadajú, a porovnáme váš web s konkurenciou.',
      },
      {
        title: 'Obsah a technické úpravy',
        text: 'Navrhneme konkrétne úpravy stránok, štruktúry a obsahu tak, aby mali väčšiu šancu rankovať.',
      },
      {
        title: 'Linkbuilding a reporting',
        text: 'Priebežne budujeme autoritu webu a sledujeme výsledky, pozície a ďalšie príležitosti na rast.',
      },
    ],
    pricing: [
      {
        name: 'SEO optimalizácia',
        price: '200 €/mes',
        items: [
          'základná SEO analýza',
          'prehľad najväčších SEO problémov',
          'konkrétne odporúčania na zlepšenie',
          'priebežné sledovanie viditeľnosti',
        ],
      },
      {
        name: 'Linkbuilding',
        price: '100 €/mes',
        items: [
          'analýza aktuálneho stavu odkazov',
          'návrh linkbuildingovej stratégie',
          '5 kvalitných spätných odkazov mesačne',
          'základný reporting',
        ],
      },
      {
        name: 'Kľúčové slová',
        price: '450 € jednorazovo',
        items: [
          'analýza kľúčových slov',
          'odporúčanie štruktúry webu',
          'návrhy pre kategórie a landing pages',
          'odporúčanie práce s obsahom',
        ],
      },
      {
        name: 'Konkurencia',
        price: '150 € jednorazovo',
        items: [
          'analýza 3 konkurenčných webov',
          'prehľad ich silných stránok',
          'odporúčania, čo zlepšiť u vás',
          'praktický výstup do ďalšej práce',
        ],
      },
      {
        name: 'SEO balík',
        price: '250 €/mes',
        items: [
          'SEO optimalizácia + linkbuilding',
          'jedna koordinovaná stratégia',
          'lepší pomer cena/výkon',
          'vhodné pre pravidelnú spoluprácu',
        ],
      },
    ],
    pricingNote: 'Ročný balík SEO bez analýzy kľúčových slov je za 2 750 €. Ročný balík vrátane analýzy kľúčových slov je za 4 000 €. Prepojenie Google Search Console, Analytics a webu je za 29 €, pri mesačnej spolupráci zdarma.',
    faq: [
      {
        q: 'Za ako dlho sa prejaví SEO?',
        a: 'SEO je dlhodobejší kanál. Prvé zlepšenia v indexácii a technickom stave bývajú rýchle, rast pozícií a organickej návštevnosti potrebuje viac času.',
      },
      {
        q: 'Musím začať veľkým balíkom?',
        a: 'Nie. Vieme začať auditom, analýzou kľúčových slov alebo len mesačným SEO balíkom a podľa výsledkov spoluprácu rozšíriť.',
      },
    ],
  },
  'texty-a-clanky': {
    slug: 'texty-a-clanky',
    title: 'SEO texty & copywriting',
    subtitle: 'Obsah, ktorý predáva aj šetrí čas',
    color: '#63b98f',
    icon: 'copy',
    heroText: 'SEO texty, produktové popisy aj nahadzovanie produktov bez chaosu. Dodáme texty, ktoré dávajú webu poriadok a vám šetria hodiny operatívy.',
    intro: [
      'Táto služba je ideálna pre e-shopy a firmy, ktoré potrebujú rýchlo doplniť veľké množstvo produktov, kategórií alebo webových textov. Vieme pripraviť samotný text, doplniť SEO vrstvy a rovno ho nahodiť do systému, aby ste nemuseli riešiť copy a administráciu zvlášť.',
      'Pri menších objemoch vieme produkty spracovať do 24 až 48 hodín. Pri väčších objemoch nastavíme harmonogram, dodržíme formátovanie, skontrolujeme údaje a odovzdáme vám prehľad hotových položiek.',
    ],
    forWhom: [
      'E-shopy, ktoré potrebujú nahodiť nové kolekcie alebo stovky produktov',
      'Firmy bez interného copy tímu',
      'Značky, ktoré chcú doplniť produktové popisy, SEO texty a kategórie',
      'Agentúry a marketéri outsourcujúci obsah a produktovú administráciu',
    ],
    whatYouGet: [
      'Nahratie produktu alebo textu priamo do systému',
      'Kontrolu správnosti údajov a čisté formátovanie',
      'Základnú úpravu textov a fotiek pre jednotný vzhľad',
      'SEO doplnenia pre produkty, kategórie alebo landing pages',
      'Prípravu webových textov, článkov a popisov podľa potreby',
      'Komunikáciu počas spracovania a finálnu kontrolu pred odovzdaním',
    ],
    process: [
      {
        title: 'Podklady',
        text: 'Pošlete nám Excel, feed, zadanie alebo prístup do administrácie.',
      },
      {
        title: 'Rozsah a termín',
        text: 'Dohodneme presný objem práce, doplnky a realistický deadline podľa počtu položiek.',
      },
      {
        title: 'Spracovanie',
        text: 'Produkty alebo texty pripravíme, naformátujeme a podľa dohody aj priamo nahráme.',
      },
      {
        title: 'Kontrola a odovzdanie',
        text: 'Dostanete prehľad hotových položiek a sumár práce, aby ste vedeli, čo je nasadené.',
      },
    ],
    pricing: [
      {
        name: 'Do 10 produktov',
        price: '2 €/produkt',
        items: [
          'ideálne na otestovanie spolupráce',
          'rýchle dodanie do 24 až 48 hodín',
          'nahodenie priamo do systému',
          'kontrola údajov a formátovania',
        ],
      },
      {
        name: '11 až 100 produktov',
        price: '1,8 €/produkt',
        items: [
          'vhodné pre nové kolekcie a sezónne doplnenia',
          'dodanie zvyčajne do 1 až 2 týždňov',
          'možnosť doplniť SEO vrstvy',
          'čisté a jednotné spracovanie',
        ],
      },
      {
        name: '101 až 500 produktov',
        price: '1,5 €/produkt',
        items: [
          'výhodnejšia cena pri väčších objemoch',
          'dodanie zvyčajne do 2 až 8 týždňov',
          'vhodné pre väčšie e-shopy a migrácie',
          'možnosť dlhodobej spolupráce',
        ],
      },
      {
        name: 'SEO článok / web text',
        price: 'od 60 €',
        items: [
          'SEO článok, landing page alebo webový text',
          'štruktúra, nadpisy a kľúčové slová',
          'možnosť nahodenia na web',
          'termín podľa rozsahu zadania',
        ],
      },
    ],
    pricingNote: 'Pri objeme nad 500 produktov pripravíme individuálnu cenu a systém spolupráce podľa rozsahu. Menšie projekty vieme často vybaviť do 48 hodín.',
    extras: [
      'vytvorenie textov alebo popisov: +3 €/produkt',
      'doplnenie SEO textov alebo SEO popisov: +1 €/produkt',
      'preklad do češtiny alebo angličtiny: +1 €/produkt za jazyk',
      'nájdenie fotiek k produktom: +1 €/produkt',
      'kontrola cien a dostupností oproti dodávateľovi: +0,5 €/produkt',
      'úprava alebo orezanie fotiek: +0,5 €/produkt',
      'doplnenie parametrov, kategórií alebo filtrov: +0,5 €/produkt',
      'nahratie produktov z feedu alebo tabuľky do e-shopu: +10 % z ceny',
    ],
    faq: [
      {
        q: 'Viete texty aj rovno nahodiť do e-shopu?',
        a: 'Áno. Služba je postavená tak, aby ste nemuseli riešiť samostatne copy aj administráciu. Vieme dodať text aj hotové nahodenie.',
      },
      {
        q: 'Robíte aj veľké objemy produktov?',
        a: 'Áno. Pri väčších objemoch nad 500 produktov nastavíme individuálny harmonogram a cenu podľa náročnosti.',
      },
      {
        q: 'Viete spraviť aj SEO vrstvu navyše?',
        a: 'Áno. K produktom a kategóriám vieme doplniť SEO texty, popisy, meta dáta aj základnú štruktúru pre lepšiu dohľadateľnosť.',
      },
    ],
  },
  'socialne-media': {
    slug: 'socialne-media',
    title: 'Sociálne médiá',
    subtitle: 'Komunita, ktorá kupuje',
    color: '#c78a62',
    icon: 'social',
    heroText: 'Správa sociálnych sietí postavená na pravidelnom obsahu, jasnom pláne a reálnom zapojení publika. Facebook, Instagram aj LinkedIn nastavíme podľa toho, kde vám to dáva najväčší zmysel.',
    intro: [
      'Sociálne siete dnes nie sú len o peknom feede. Sú o dôvere, pripomínaní značky a pravidelnom kontakte s ľuďmi, ktorí od vás môžu kúpiť. Preto nepracujeme len s publikovaním, ale aj s plánom, trendmi, reakciami komunity a vyhodnocovaním toho, čo funguje.',
      'Obsah pripravujeme tak, aby bol použiteľný naprieč platformami. Neuzamykáme vás na jednu sociálnu sieť, ale prispôsobujeme výstupy tomu, či je pre vás kľúčový Facebook, Instagram, LinkedIn alebo ich kombinácia.',
    ],
    forWhom: [
      'Lokálne podniky, ktoré chcú byť viditeľné a pravidelne pripomínať svoju značku',
      'E-shopy budujúce komunitu a opakované nákupy',
      'Služby a odborníci, ktorí chcú pôsobiť dôveryhodne a profesionálne',
      'Firmy, ktoré potrebujú pravidelný obsah bez chaosu a naháňania termínov',
    ],
    whatYouGet: [
      '30-dňový obsahový plán podľa cieľov značky',
      'Tvorbu príspevkov, stories a reels podľa vybraného balíka',
      'Copywriting textov a návrhy tém podľa trendov a sezóny',
      'Monitoring komentárov, trendov a spätnej väzby od publika',
      'Mesačný report s výsledkami a odporúčaniami',
      'Možnosť zapojiť súťaže, podporu v správach a rast komunity pri vyšších balíkoch',
    ],
    process: [
      {
        title: 'Úvodná konzultácia',
        text: 'Prejdeme si značku, ciele, tone of voice a platformy, ktoré sú pre vás dôležité.',
      },
      {
        title: 'Balík a plán',
        text: 'Zvolíme rozsah spolupráce a pripravíme 30-dňový obsahový plán.',
      },
      {
        title: 'Produkcia obsahu',
        text: 'Vytvoríme príspevky, stories, reels a texty v jednotnom štýle.',
      },
      {
        title: 'Publikovanie a interakcia',
        text: 'Obsah nasadzujeme, sledujeme reakcie a podľa balíka riešime aj komentáre či správy.',
      },
      {
        title: 'Report a zlepšenia',
        text: 'Každý mesiac vyhodnotíme výsledky a upravíme ďalší plán podľa toho, čo funguje.',
      },
    ],
    pricing: [
      {
        name: 'ZÁKLAD',
        price: '200 €/mes',
        items: [
          '12 príspevkov + 4 stories',
          '30-dňový plán obsahu',
          'sledovanie trendov',
          'mesačný report',
        ],
      },
      {
        name: 'ROZBEH',
        price: '300 €/mes',
        items: [
          '16 príspevkov + 8 stories + 4 reels',
          '30-dňový plán obsahu',
          'monitoring komentárov a trendov',
          'mesačný report',
        ],
      },
      {
        name: 'EXPANZIA',
        price: '500 €/mes',
        items: [
          '30 príspevkov + 16 stories + 4 reels',
          '30-dňový plán obsahu',
          'podpora v správach a komentároch',
          'súťaže a organický rast publika',
        ],
      },
    ],
    pricingNote: 'Balík ROZBEH je najvýhodnejšia voľba pre firmy, ktoré už chcú mať viditeľný, pravidelný a živý profil. Platformy vyberáme podľa vašej značky, nie fixne len podľa jednej siete.',
    extras: [
      'Canva šablóny pre sociálne siete: 190 € / 390 € / 590 € podľa rozsahu',
      'šablóny pre príspevky, stories a reels v jednotnej vizuálnej identite',
      'prispôsobenie farbám, fontom, logu a štýlu komunikácie',
      'dodanie cez Canva link s možnosťou ďalších úprav',
    ],
    faq: [
      {
        q: 'Musí to byť len jedna sociálna sieť?',
        a: 'Nie. Obsah a formáty prispôsobujeme tomu, kde je vaša cieľová skupina. Môže to byť Facebook, Instagram, LinkedIn alebo kombinácia viacerých kanálov.',
      },
      {
        q: 'Robíte aj reels a stories?',
        a: 'Áno. V balíkoch ROZBEH a EXPANZIA sú reels aj stories priamo zahrnuté.',
      },
    ],
  },
  'email-marketing': {
    slug: 'email-marketing',
    title: 'Email marketing',
    subtitle: 'Retenčný kanál s najvyšším ROI',
    color: '#b18ae0',
    icon: 'email',
    heroText: 'Email marketing patrí medzi najsilnejšie kanály pre e-shopy aj služby. Nastavíme techniku, segmentáciu a automatizácie tak, aby databáza pravidelne zarábala.',
    intro: [
      'Ak nepracujete s emailovou databázou, nechávate peniaze na stole. Email marketing vracia späť ľudí, ktorí vás už poznajú, pripomína sa po nákupe, pracuje s opusteným košíkom a buduje publikum, ktoré vám nikto nevezme algoritmom.',
      'Nastavíme technickú časť, prepojíme formuláre s webom, pripravíme segmentáciu, automatizácie aj newslettery. Následne môžeme email marketing spravovať pravidelne, aby ste neostali len pri jednorazovom nastavení.',
    ],
    forWhom: [
      'E-shopy s existujúcou databázou zákazníkov alebo návštevníkov',
      'Firmy, ktoré chcú získať viac z doterajších kontaktov',
      'Značky, ktoré potrebujú automatizácie po nákupe alebo pri opustenom košíku',
      'Služby a digitálne produkty, ktoré chcú pracovať s dlhším rozhodovaním klienta',
    ],
    whatYouGet: [
      'Inštaláciu a konfiguráciu emailového systému',
      'Prepojenie s formulármi, webom alebo e-shopom',
      'Vytvorenie alebo import databázy kontaktov',
      'Segmentáciu kontaktov a nastavenie tagov',
      'Tvorbu newsletter šablón a automatizovaných sekvencií',
      'Testovanie doručiteľnosti a vzhľadu emailov',
      'GDPR funkčnosť, reporting a odporúčania na rast databázy',
    ],
    process: [
      {
        title: 'Setup platformy',
        text: 'Nainštalujeme a nastavíme platformu, napojíme formuláre, web a pripravíme databázu.',
      },
      {
        title: 'Segmentácia a šablóny',
        text: 'Rozdelíme kontakty, pripravíme tagy, newsletter šablóny a základné automatizácie.',
      },
      {
        title: 'Automatizácie',
        text: 'Nastavíme napríklad welcome sériu, email po nákupe, opustený košík alebo výročný email.',
      },
      {
        title: 'Mesačná správa',
        text: 'Pri pravidelnej spolupráci plánujeme newslettery, sledujeme výsledky, rozširujeme databázu a optimalizujeme kampane.',
      },
    ],
    pricing: [
      {
        name: 'MINI',
        price: '200 € setup + 70 €/mes',
        items: [
          '1 newsletter mesačne',
          '1 základná automatizácia',
          'import do 1 000 kontaktov',
          'základné tagovanie',
          '1 šablóna a základný report',
        ],
      },
      {
        name: 'STANDARD',
        price: '400 € setup + 150 €/mes',
        items: [
          'do 3 newsletterov mesačne',
          'do 3 automatizačných sekvencií',
          'import do 10 000 kontaktov',
          'pokročilé tagovanie',
          'do 3 šablón a rozšírený report',
        ],
      },
      {
        name: 'PRO',
        price: '500 € setup + 250 €/mes',
        items: [
          'do 6 newsletterov mesačne',
          '5 a viac sekvencií',
          'neobmedzený import kontaktov',
          'smart segmentácia a testovanie',
          'neobmedzené šablóny a rozšírená analýza',
        ],
      },
    ],
    pricingNote: 'Priemerne sa pri email marketingu pracuje s ROI okolo 42 € na každé 1 € investície. Presný rozsah mesačnej správy nastavíme podľa objemu databázy a počtu kampaní.',
    extras: [
      'nastavenie Amazon SES: 200 €',
      'extra newsletter nad rámec balíka: 30 € / kus',
      'dodatočná automatizácia: 50 € / sekvencia',
      'web formulár na zber leadov: 80 €',
      'popup na zber leadov: 120 €',
      'lead magnet (PDF + doručovací email): 180 € až 450 €',
    ],
    faq: [
      {
        q: 'Aký je rozdiel medzi newsletterom a cold emailingom?',
        a: 'Newsletter ide na vašu vlastnú databázu ľudí, ktorí vás už poznajú alebo sa prihlásili. Cold emailing je oslovovanie nových kontaktov, s ktorými ste ešte neboli v kontakte.',
      },
      {
        q: 'Viete nastaviť aj automatizácie po nákupe?',
        a: 'Áno. Bežne nastavujeme welcome sekvencie, opustený košík, pripomenutie po nákupe, win-back kampane alebo výročné emaily.',
      },
    ],
  },
  'tvorba-webov': {
    slug: 'tvorba-webov',
    title: 'Tvorba webov & e-shopov',
    subtitle: 'Weby, ktoré konvertujú',
    color: '#7dd3c8',
    icon: 'web',
    heroText: 'Tvoríme weby a e-shopy, ktoré vyzerajú moderne, fungujú rýchlo a dávajú zmysel obchodne aj marketingovo.',
    intro: [
      'Nestačí mať pekný web. Potrebujete web, ktorý sa dobre načíta, ľahko sa používa, má jasnú štruktúru a pripraví pôdu pre SEO aj kampane. Preto spájame dizajn, techniku a konverznú logiku do jedného celku.',
      'Robíme prezentačné weby, firemné stránky aj e-shopy na WordPresse a Shoptete. Od návrhu štruktúry cez vizuál až po spustenie a analytiku.',
    ],
    forWhom: [
      'Firmy bez webu alebo so zastaraným webom',
      'E-shopy, ktoré chcú modernejší a výkonnejší predajný kanál',
      'Značky, ktoré chcú web pripravený na SEO a kampane',
      'Firmy, ktoré chcú partnera od dizajnu po spustenie',
    ],
    whatYouGet: [
      'Dizajn na mieru podľa značky a cieľov webu',
      'Responzívne spracovanie pre mobil, tablet aj desktop',
      'Rýchly technický základ a čistú štruktúru stránky',
      'SEO pripravené titulky, textové bloky a technické nastavenie',
      'Napojenie formulárov, analytiky a základného merania',
      'Podporu pri spustení a odovzdaní',
    ],
    process: [
      {
        title: 'Zadanie a štruktúra',
        text: 'Prejdeme si cieľ webu, obsah, funkcionalitu a navrhneme logickú štruktúru stránok.',
      },
      {
        title: 'Dizajn a obsah',
        text: 'Pripravíme vizuálny smer, layouty a podľa potreby aj textové alebo SEO odporúčania.',
      },
      {
        title: 'Vývoj a napojenia',
        text: 'Web postavíme, napojíme formuláre, analytiku a pripravíme všetko na ostré spustenie.',
      },
      {
        title: 'Launch a podpora',
        text: 'Po nasadení doladíme detaily, odovzdáme prístupy a vieme pokračovať ďalším rozvojom.',
      },
    ],
    pricing: [
      { name: 'Web cez našu technológiu', price: 'od 300 €', items: ['rýchle nasadenie', 'nie je určený na samostatnú editáciu', 'ročná podpora 30 min mesačne', 'vhodné pre menšie prezentačné weby'] },
      { name: 'Prezentačný web', price: 'od 800 €', items: ['šablóna alebo WordPress', '5 až 10 podstránok', 'SEO základ', 'kontaktný formulár', 'mobilná verzia'] },
      { name: 'Web na mieru', price: 'od 2 000 €', items: ['dizajn na mieru', 'pokročilé SEO', 'rýchlostná optimalizácia', 'analytika', 'vyššia flexibilita'] },
      { name: 'Shoptet e-shop', price: 'od 800 €', items: ['nastavenie Shoptetu', 'úprava témy', 'import produktov', 'platobné metódy', 'základné SEO'] },
      { name: 'WordPress e-shop', price: 'od 2 500 €', items: ['WooCommerce', 'dizajn na mieru', 'produktový katalóg', 'platobná brána', 'SEO a analytika'] },
    ],
    pricingNote: 'Weby cez našu technológiu sú vhodné, ak chcete rýchle a cenovo dostupné riešenie. Po spustení ich neviete samostatne editovať, ale v cene je ročná podpora v rozsahu 30 minút mesačne.',
  },
  'komplexny-growth': {
    slug: 'komplexny-growth',
    title: 'Komplexný Growth',
    subtitle: 'Jedna stratégia, viac kanálov',
    color: '#7dd3c8',
    icon: 'copy',
    heroText: 'Pre firmy, ktoré nechcú riešiť marketing po častiach. Poskladáme cold email, SEO, sociálne siete, email marketing aj web do jedného funkčného rastového systému.',
    intro: [
      'Nie každá firma potrebuje každý kanál. Potrebuje však jasne vedieť, čo má robiť teraz, čo má prioritu a ako sa jednotlivé aktivity prepájajú. Práve preto vznikol komplexný growth model.',
      'Namiesto izolovaných úloh skladáme spoločnú stratégiu: čo privedie dopyt, čo zvýši dôveru, čo zlepší konverziu a čo sa postará o retenciu. Všetko v jednom pláne a s jedným reportingom.',
    ],
    forWhom: [
      'Firmy, ktoré chcú jedného partnera namiesto viacerých dodávateľov',
      'Značky vo fáze rastu, ktoré potrebujú koordináciu naprieč kanálmi',
      'E-shopy a služby, ktoré chcú zvýšiť dopyt aj retenciu naraz',
      'Majitelia, ktorí chcú mať jasný plán, priority a reporting',
    ],
    whatYouGet: [
      'Rastový audit a prioritizáciu kanálov podľa potenciálu',
      'Mesačný plán kampaní, obsahu a výkonových aktivít',
      'Prepojenie cold emailu, SEO, sociálnych sietí a email marketingu',
      'Landing pages, lead magnety a konverzné úpravy webu',
      'Jednotný reporting a strategické konzultácie',
      'Priebežnú optimalizáciu podľa dát a obchodných cieľov',
    ],
    process: [
      {
        title: 'Audit',
        text: 'Zistíme, kde sú najväčšie príležitosti a ktoré kanály majú priniesť najrýchlejší efekt.',
      },
      {
        title: 'Roadmapa',
        text: 'Rozdelíme aktivity na priority a pripravíme plán, ktorý dáva zmysel kapacitne aj obchodne.',
      },
      {
        title: 'Spustenie kanálov',
        text: 'Nasadzujeme vybrané kanály tak, aby sa dopĺňali, nie kanibalizovali.',
      },
      {
        title: 'Vyhodnocovanie',
        text: 'Každý mesiac sledujeme výsledky a presúvame energiu tam, kde je najväčší dopad.',
      },
    ],
    pricing: [
      { name: 'Sprint', price: 'od 900 €/mes', items: ['audit + roadmapa', '2 hlavné kanály', 'mesačný reporting', '1 strategický call'] },
      { name: 'Scale', price: 'od 1 500 €/mes', items: ['3 až 4 prepojené kanály', 'obsah + distribúcia', 'lead gen funnel', 'bi-týždenné konzultácie'] },
      { name: 'Partner', price: 'od 2 500 €/mes', items: ['kompletný growth stack', 'priebežné experimenty', 'týždenné vyhodnocovanie', 'dedikovaná spolupráca'] },
    ],
    faq: [
      { q: 'Je to vhodné aj pre menšie firmy?', a: 'Áno, ak už máte funkčný produkt alebo službu a chcete systematicky rásť. Growth spolupráca dáva najväčší zmysel tam, kde vieme prepájať viac kanálov naraz.' },
      { q: 'Musím využívať všetky kanály?', a: 'Nie. Stratégiu skladáme podľa cieľov a kapacít. Niekedy majú zmysel dva silné kanály, inokedy širší mix.' },
      { q: 'Ako rýchlo uvidím výsledky?', a: 'Niektoré kanály prinesú reakcie v priebehu týždňov, iné sa rozbiehajú dlhšie. Dôležité je, že všetko riadime v jednom pláne a vieme presne, čo funguje.' },
    ],
  },
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: Object.keys(servicesData).map(slug => ({ params: { slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  return { props: { service: servicesData[slug] || null } };
};

export default function ServicePage({ service }: { service: ServiceData }) {
  if (!service) return null;

  return (
    <>
      <SEO
        title={service.title}
        description={service.heroText}
        canonical={`${SITE_URL}/sluzby/${service.slug}/`}
      />
      <Nav />
      <main>
        {/* HERO */}
        <section className="svc-hero">
          <Link href="/sluzby/" className="svc-back">← Späť na služby</Link>
          <div className="svc-hero-row">
            <span className="svc-hero-ico"><ServiceIcon name={service.icon} size={40} /></span>
            <div>
              <div className="svc-eyebrow">{service.subtitle}</div>
              <h1 className="svc-title">{service.title}</h1>
            </div>
          </div>
          <p className="svc-lead">{service.heroText}</p>
          <Link href="/kontakt/" className="btn-primary">Chcem konzultáciu →</Link>
        </section>

        <div className="svc-wrap">
          {service.intro && (
            <section className="svc-block">
              <h2 className="svc-block-h2">Viac o službe</h2>
              <div className="svc-prose">
                {service.intro.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </section>
          )}

          <div className="svc-cols">
            <section className="svc-block">
              <h2 className="svc-block-h2">Pre koho je táto služba</h2>
              <ul className="svc-list">
                {service.forWhom.map((item, i) => (
                  <li key={i}><span className="svc-ic"><ArrowRightIcon size={14} /></span>{item}</li>
                ))}
              </ul>
            </section>
            <section className="svc-block">
              <h2 className="svc-block-h2">Čo dostanete</h2>
              <ul className="svc-list">
                {service.whatYouGet.map((item, i) => (
                  <li key={i}><span className="svc-ic"><CheckIcon size={14} /></span>{item}</li>
                ))}
              </ul>
            </section>
          </div>

          {service.process && (
            <section>
              <h2 className="svc-h2">Ako prebieha spolupráca</h2>
              <div className="svc-steps">
                {service.process.map((step, i) => (
                  <div key={step.title} className="svc-step">
                    <div className="svc-step-n">0{i + 1}</div>
                    <h3 className="svc-step-t">{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="svc-h2">Cenník</h2>
            <div className="svc-price-grid">
              {service.pricing.map((plan, i) => (
                <div key={i} className={`svc-price-card${i === Math.floor(service.pricing.length / 2) ? ' is-hot' : ''}`}>
                  <span className="svc-price-name">{plan.name}</span>
                  <div className="svc-price-val">{plan.price}</div>
                  <ul className="svc-list">
                    {plan.items.map((item, j) => (
                      <li key={j}><span className="svc-ic"><CheckIcon size={13} /></span>{item}</li>
                    ))}
                  </ul>
                  <Link href="/kontakt/" className="svc-price-btn">Mám záujem →</Link>
                </div>
              ))}
            </div>
          </section>

          {(service.pricingNote || service.extras) && (
            <div className="svc-cols">
              {service.pricingNote && (
                <section className="svc-block">
                  <h2 className="svc-block-h2">Dôležité k cenníku</h2>
                  <div className="svc-prose"><p>{service.pricingNote}</p></div>
                </section>
              )}
              {service.extras && (
                <section className="svc-block">
                  <h2 className="svc-block-h2">Doplnky a rozšírenia</h2>
                  <ul className="svc-list">
                    {service.extras.map((item, i) => (
                      <li key={i}><span className="svc-ic"><ArrowRightIcon size={14} /></span>{item}</li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}

          {service.faq && (
            <section>
              <h2 className="svc-h2">Časté otázky</h2>
              <div className="svc-faq">
                {service.faq.map((item, i) => (
                  <div key={i} className="svc-faq-item">
                    <h3 className="svc-faq-q">{item.q}</h3>
                    <p className="svc-faq-a">{item.a}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="svc-final-cta">
            <div>
              <h2 className="svc-final-h2">Zaujalo vás to?</h2>
              <p className="svc-final-p">Nezáväzná konzultácia zdarma. Odpovieme do 24 hodín.</p>
            </div>
            <Link href="/kontakt/" className="svc-final-btn">Dohodnúť konzultáciu →</Link>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
