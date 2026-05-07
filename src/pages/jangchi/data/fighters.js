import amirxan from '../../../assets/images/amirxan.png';
import xotambek from '../../../assets/images/xotambek.png';
import nursultan from '../../../assets/images/nursultan.png';
import mahmud from '../../../assets/images/mahmud.png';
import timur from '../../../assets/images/timur-valiyev.png';
import taysin from '../../../assets/images/taysin.png';

export const fighterProfiles = [
  {
    id: 1,
    slug: 'amirxon-alixojayev',
    image: amirxan,
    fullName: `Amirxon "Alixo'jayev"`,
    city: 'Toshkent',
    neighborhood: 'Yunusobod',
    category: 'MMA',
    type: 'jangchi',
    role: 'Sobiq hududiy yarim o`rta vazn chempioni',
    price: '$50/soat',
    bonus: 'Birinchi bron bepul',
    duration: '60 daqiqa',
    format: 'Offline',
    timezone: 'Asia/Tashkent',
    video: '',
    availableTimes: ['10:00', '12:30', '15:00'],
    about:
      'Amirxon texnika, harakat va zarba kombinatsiyalarini chuqur tushuntirib beradigan tajribali jangchi. Individual mashg`ulotlar yangi boshlovchilar va professional sportchilar uchun moslashtiriladi.',
    highlights: [
      { id: 1, title: 'Mashxur janglari 1', image: amirxan, video: '' },
      { id: 2, title: 'Mashxur janglari 2', image: amirxan, video: '' }
    ]
  },
  {
    id: 2,
    slug: 'xotambek-boynazarov',
    image: xotambek,
    fullName: `Xotambek "Boynazarov"`,
    city: 'Toshkent',
    neighborhood: 'Chilonzor',
    category: 'MMA',
    type: 'jangchi',
    role: 'Professional turnir ishtirokchisi',
    price: '$55/soat',
    bonus: 'Birinchi bron bepul',
    duration: '55 daqiqa',
    format: 'Offline',
    timezone: 'Asia/Tashkent',
    video: '',
    availableTimes: ['09:30', '13:00', '18:00'],
    about:
      'Xotambek tayyorlov jarayonida funksional kuch, himoya va tempni oshirishga e`tibor beradi. U bilan darslar sparringga tayyorgarlik ko`rayotganlar uchun ayniqsa foydali.',
    highlights: [
      { id: 1, title: 'Mashxur janglari 1', image: xotambek, video: '' },
      { id: 2, title: 'Mashxur janglari 2', image: xotambek, video: '' }
    ]
  },
  {
    id: 3,
    slug: 'nursultan-roziboyev',
    image: nursultan,
    fullName: `Nursultan "Ro'ziboyev"`,
    city: 'Samarqand',
    neighborhood: 'Markaz',
    category: 'MMA',
    type: 'jangchi',
    role: 'Striking va grappling bo`yicha kuchli',
    price: '$58/soat',
    bonus: 'Birinchi bron bepul',
    duration: '50 daqiqa',
    format: 'Offline',
    timezone: 'Asia/Tashkent',
    video: '',
    availableTimes: ['11:00', '14:30', '17:00'],
    about:
      'Nursultan tezlik va refleks ustida ishlashni yoqtiradi. Mashg`ulotlarda kombinatsion hujum, oyoq ishlashi va jang davomida bosimni boshqarish ustida ishlanadi.',
    highlights: [
      { id: 1, title: 'Mashxur janglari 1', image: nursultan, video: '' },
      { id: 2, title: 'Mashxur janglari 2', image: nursultan, video: '' }
    ]
  },
  {
    id: 4,
    slug: 'mahmud-murodov',
    image: mahmud,
    fullName: 'Mahmud Murodov',
    city: 'Jizzax',
    neighborhood: 'Yangiobod',
    category: 'MMA',
    type: 'murabbiy',
    role: '5 karra og`ir vazn chempioni',
    price: '$60/soat',
    bonus: 'Birinchi bron bepul',
    duration: '60 daqiqa',
    format: 'Offline',
    timezone: 'Asia/Tashkent',
    video: '',
    availableTimes: ['08:00', '12:00', '19:00'],
    about:
      'Mahmud jangga tayyorgarlik va kuchli psixologik tayyorgarlik bo`yicha aniq tizim bilan ishlaydi. Uning darslari intizom va to`g`ri reja asosida olib boriladi.',
    highlights: [
      { id: 1, title: 'Mashxur janglari 1', image: mahmud, video: '' },
      { id: 2, title: 'Mashxur janglari 2', image: mahmud, video: '' }
    ]
  },
  {
    id: 5,
    slug: 'timur-valiyev',
    image: timur,
    fullName: 'Timur Valiyev',
    city: 'Xorazm',
    neighborhood: 'Urganch',
    category: 'Boks',
    type: 'murabbiy',
    role: 'Yuqori darajadagi fight camp murabbiysi',
    price: '$54/soat',
    bonus: 'Birinchi bron bepul',
    duration: '45 daqiqa',
    format: 'Offline',
    timezone: 'Asia/Tashkent',
    video: '',
    availableTimes: ['09:00', '16:00', '20:00'],
    about:
      'Timur texnik mashqlarni oddiy va tushunarli formatda beradi. U ayniqsa himoya, counter attack va ring bo`ylab harakatlanish ustida sifatli ishlaydi.',
    highlights: [
      { id: 1, title: 'Mashxur janglari 1', image: timur, video: '' },
      { id: 2, title: 'Mashxur janglari 2', image: timur, video: '' }
    ]
  },
  {
    id: 6,
    slug: 'ozbek-taysin',
    image: taysin,
    fullName: `O'zbek Taysin`,
    city: 'Farg`ona',
    neighborhood: 'Marg`ilon',
    category: 'Muay Tay',
    type: 'murabbiy',
    role: 'Professional MMA jangchisi',
    price: '$65/soat',
    bonus: 'Birinchi bron bepul',
    duration: '60 daqiqa',
    format: 'Offline',
    timezone: 'Asia/Tashkent',
    video: '',
    availableTimes: ['10:30', '13:30', '18:30'],
    about:
      'O`zbek Taysin kuchli zarba va chidamlilikni oshirish bo`yicha individual dasturlar tuzadi. Uning mashg`ulotlari musobaqaga tayyorgarlik ko`rayotganlar uchun ham mos.',
    highlights: [
      { id: 1, title: 'Mashxur janglari 1', image: taysin, video: '' },
      { id: 2, title: 'Mashxur janglari 2', image: taysin, video: '' }
    ]
  }
];
