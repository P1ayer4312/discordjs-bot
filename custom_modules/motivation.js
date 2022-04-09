const axios = require('axios');
const {
	MessageEmbed
} = require('discord.js')

function fetchRandomQuote(msg) {
	axios.get('https://zenquotes.io/api/random')
		.then(response => {
			const data = response.data[0];
			const author = data.a;
			const quote = data.q;
			let imgUrl = IMGS[author];
			if (imgUrl == undefined) 
				imgUrl = 'https://i.imgur.com/WybxO5n.jpeg';

			const embed = new MessageEmbed()
				.setColor('#ffa31a')
				.setTitle(`*${quote}*`)
				.setDescription(`- *${author}*`)
				.setThumbnail(imgUrl);

			msg.channel.send({
				embeds: [embed]
			});
		});
}

/* 
 * Why pay for image access when you can just scrape them :)
const imgs = {};
document.querySelectorAll('.stretched-link')
	.forEach(el => {
		const name = el.querySelector('h6').innerText;
		const imgUrl = el.querySelector('img').getAttribute('src');
		imgs[name] = imgUrl;
	});
console.log(imgs);
*/

const IMGS = {
	"A.A. Milne": "https://zenquotes.io/img/a_a_-milne.jpg",
	"Abraham Lincoln": "https://zenquotes.io/img/abraham-lincoln.jpg",
	"Adi Da Samraj": "https://zenquotes.io/img/adi-da-samraj.jpg",
	"Alan Watts": "https://zenquotes.io/img/alan-watts.jpg",
	"Albert Einstein": "https://zenquotes.io/img/albert-einstein.jpg",
	"Albus Dumbledore": undefined,
	"Alexander Graham Bell": "https://zenquotes.io/img/alexander-graham-bell.jpg",
	"Alexander Pope": "https://zenquotes.io/img/alexander-pope.jpg",
	"Alexandre Dumas": "https://zenquotes.io/img/alexandre-dumas.jpg",
	"Alfred Adler": "https://zenquotes.io/img/alfred-adler.jpg",
	"Amelia Earhart": "https://zenquotes.io/img/amelia-earhart.jpg",
	"Andrew Hendrixson": undefined,
	"Anita Krizzan": undefined,
	"Anne Frank": "https://zenquotes.io/img/anne-frank.jpg",
	"Anne Wilson Schaef": "https://zenquotes.io/img/anne-wilson-schaef.jpg",
	"Aristotle": "https://zenquotes.io/img/aristotle.jpg",
	"Audrey Hepburn": "https://zenquotes.io/img/audrey-hepburn.jpg",
	"Ayn Rand": "https://zenquotes.io/img/ayn-rand.jpg",
	"Babe Ruth": "https://zenquotes.io/img/babe-ruth.jpg",
	"Barack Obama": "https://zenquotes.io/img/barack-obama.jpg",
	"Benjamin Franklin": "https://zenquotes.io/img/benjamin-franklin.jpg",
	"Benjamin Mays": "https://zenquotes.io/img/benjamin-mays.jpg",
	"Bette Midler": "https://zenquotes.io/img/bette-midler.jpg",
	"Beverly Sills": "https://zenquotes.io/img/beverly-sills.jpg",
	"Billie Jean King": "https://zenquotes.io/img/billie-jean-king.jpg",
	"Bob Dylan": "https://zenquotes.io/img/bob-dylan.jpg",
	"Bob Marley": "https://zenquotes.io/img/bob-marley.jpg",
	"Bob Proctor": "https://zenquotes.io/img/bob-proctor.jpg",
	"Bodhidharma": "https://zenquotes.io/img/bodhidharma.jpg",
	"Brian Tracy": "https://zenquotes.io/img/brian-tracy.jpg",
	"Bruce Lee": "https://zenquotes.io/img/bruce-lee.jpg",
	"Buddha": "https://zenquotes.io/img/buddha.jpg",
	"Candice Carpenter": undefined,
	"Carl Jung": "https://zenquotes.io/img/carl-jung.jpg",
	"Carlos Ruiz Zafon": "https://zenquotes.io/img/carlos-ruiz-zafon.jpg",
	"Celestine Chua": "https://zenquotes.io/img/celestine-chua.jpg",
	"Charles Darwin": "https://zenquotes.io/img/charles-darwin.jpg",
	"Charles Dickens": "https://zenquotes.io/img/charles-dickens.jpg",
	"Charles Spurgeon": "https://zenquotes.io/img/charles-spurgeon.jpg",
	"Charles Swindoll": "https://zenquotes.io/img/charles-swindoll.jpg",
	"Charlie Chaplin": "https://zenquotes.io/img/charlie-chaplin.jpg",
	"Cherie Gilderbloom": undefined,
	"Cherralea Morgen": undefined,
	"Chinese Proverb": "https://zenquotes.io/img/chinese-proverb.jpg",
	"Christopher McCandless": "https://zenquotes.io/img/christopher-mccandless.jpg",
	"Christopher Reeve": "https://zenquotes.io/img/christopher-reeve.jpg",
	"Coco Chanel": "https://zenquotes.io/img/coco-chanel.jpg",
	"Colin Powell": "https://zenquotes.io/img/colin-powell.jpg",
	"Colin R. Davis": "https://zenquotes.io/img/colin-r_-davis.jpg",
	"Confucius": "https://zenquotes.io/img/confucius.jpg",
	"Conrad Hilton": "https://zenquotes.io/img/conrad-hilton.jpg",
	"Criss Jami": undefined,
	"D. H. Lawrence": "https://zenquotes.io/img/d_-h_-lawrence.jpg",
	"Dalai Lama": undefined,
	"Dale Carnegie": "https://zenquotes.io/img/dale-carnegie.jpg",
	"Dan Brown": "https://zenquotes.io/img/dan-brown.jpg",
	"David Brinkley": "https://zenquotes.io/img/david-brinkley.jpg",
	"Denis Waitley": "https://zenquotes.io/img/denis-waitley.jpg",
	"Dogen": "https://zenquotes.io/img/dogen.jpg",
	"Doug Ivester": "https://zenquotes.io/img/doug-ivester.jpg",
	"Dr. Seuss": "https://zenquotes.io/img/dr_-seuss.jpg",
	"Earl Nightingale": "https://zenquotes.io/img/earl-nightingale.jpg",
	"Eckhart Tolle": "https://zenquotes.io/img/eckhart-tolle.jpg",
	"Elbert Hubbard": "https://zenquotes.io/img/elbert-hubbard.jpg",
	"Eleanor Roosevelt": "https://zenquotes.io/img/eleanor-roosevelt.jpg",
	"Elon Musk": "https://zenquotes.io/img/elon-musk.jpg",
	"Emily Dickinson": "https://zenquotes.io/img/emily-dickinson.jpg",
	"Epictetus": "https://zenquotes.io/img/epictetus.jpg",
	"Eric Hoffer": "https://zenquotes.io/img/eric-hoffer.jpg",
	"Estee Lauder": "https://zenquotes.io/img/estee-lauder.jpg",
	"Euripides": "https://zenquotes.io/img/euripides.jpg",
	"F. Scott Fitzgerald": "https://zenquotes.io/img/f_-scott-fitzgerald.jpg",
	"Franklin D. Roosevelt": "https://zenquotes.io/img/franklin-d_-roosevelt.jpg",
	"Franz Kafka": "https://zenquotes.io/img/franz-kafka.jpg",
	"G.I. Gurdjieff": "https://zenquotes.io/img/g_i_-gurdjieff.jpg",
	"Gabor Mate": "https://zenquotes.io/img/gabor-mate.jpg",
	"Genghis Khan": "https://zenquotes.io/img/genghis-khan.jpg",
	"George Addair": "https://zenquotes.io/img/george-addair.jpg",
	"George Bernard Shaw": "https://zenquotes.io/img/george-bernard-shaw.jpg",
	"George Eliot": "https://zenquotes.io/img/george-eliot.jpg",
	"George Washington": "https://zenquotes.io/img/george-washington.jpg",
	"Gilbert Chesterton": "https://zenquotes.io/img/gilbert-chesterton.jpg",
	"Grace Coddington": "https://zenquotes.io/img/grace-coddington.jpg",
	"Gurbaksh Chahal": "https://zenquotes.io/img/gurbaksh-chahal.jpg",
	"Hans Christian Andersen": "https://zenquotes.io/img/hans-christian-andersen.jpg",
	"Helen Keller": "https://zenquotes.io/img/helen-keller.jpg",
	"Henry David Thoreau": "https://zenquotes.io/img/henry-david-thoreau.jpg",
	"Henry Ford": "https://zenquotes.io/img/henry-ford.jpg",
	"Herman Melville": "https://zenquotes.io/img/herman-melville.jpg",
	"Herodotus": "https://zenquotes.io/img/herodotus.jpg",
	"Honore de Balzac": "https://zenquotes.io/img/honore-de-balzac.jpg",
	"Huang Po": "https://zenquotes.io/img/huang-po.jpg",
	"Isaac Newton": "https://zenquotes.io/img/isaac-newton.jpg",
	"J.R.R. Tolkien": "https://zenquotes.io/img/j_r_r_-tolkien.jpg",
	"Jack Butcher": "https://zenquotes.io/img/jack-butcher.jpg",
	"Jack Kerouac": "https://zenquotes.io/img/jack-kerouac.jpg",
	"Jack London": "https://zenquotes.io/img/jack-london.jpg",
	"James Allen": "https://zenquotes.io/img/james-allen.jpg",
	"James Cameron": "https://zenquotes.io/img/james-cameron.jpg",
	"James Matthew Barrie": "https://zenquotes.io/img/james-matthew-barrie.jpg",
	"Jiddu Krishnamurti": "https://zenquotes.io/img/jiddu-krishnamurti.jpg",
	"Jim Rohn": "https://zenquotes.io/img/jim-rohn.jpg",
	"Joan Rivers": "https://zenquotes.io/img/joan-rivers.jpg",
	"Johann Wolfgang von Goethe": "https://zenquotes.io/img/johann-wolfgang-von-goethe.jpg",
	"John D. Rockefeller": "https://zenquotes.io/img/john-d_-rockefeller.jpg",
	"John Eliot": undefined,
	"John Lennon": "https://zenquotes.io/img/john-lennon.jpg",
	"John Locke": "https://zenquotes.io/img/john-locke.jpg",
	"John Tukey": "https://zenquotes.io/img/john-tukey.jpg",
	"John Wooden": "https://zenquotes.io/img/john-wooden.jpg",
	"Jon Kabat-Zinn": "https://zenquotes.io/img/jon-kabat--zinn.jpg",
	"Jonathan Swift": "https://zenquotes.io/img/jonathan-swift.jpg",
	"Josh Waitzkin": "https://zenquotes.io/img/josh-waitzkin.jpg",
	"Judy Garland": "https://zenquotes.io/img/judy-garland.jpg",
	"Kahlil Gibran": "https://zenquotes.io/img/kahlil-gibran.jpg",
	"Kilian Jornet": undefined,
	"Lao Tzu": "https://zenquotes.io/img/lao-tzu.jpg",
	"Laurence J. Peter": "https://zenquotes.io/img/laurence-j_-peter.jpg",
	"Leo Tolstoy": "https://zenquotes.io/img/leo-tolstoy.jpg",
	"Leonardo da Vinci": "https://zenquotes.io/img/leonardo-da-vinci.jpg",
	"Les Brown": "https://zenquotes.io/img/les-brown.jpg",
	"Lin Yutang": "https://zenquotes.io/img/lin-yutang.jpg",
	"Mahatma Gandhi": "https://zenquotes.io/img/mahatma-gandhi.jpg",
	"Marcus Aurelius": "https://zenquotes.io/img/marcus-aurelius.jpg",
	"Margaret Mead": "https://zenquotes.io/img/margaret-mead.jpg",
	"Marilyn Monroe": "https://zenquotes.io/img/marilyn-monroe.jpg",
	"Mark Twain": "https://zenquotes.io/img/mark-twain.jpg",
	"Martin Luther": "https://zenquotes.io/img/martin-luther.jpg",
	"Martin Luther King, Jr.": "https://zenquotes.io/img/martin-luther-king-jr_.jpg",
	"Maxime Lagace": "https://zenquotes.io/img/maxime-lagace.jpg",
	"Maya Angelou": "https://zenquotes.io/img/maya-angelou.jpg",
	"Meister Eckhart": "https://zenquotes.io/img/meister-eckhart.jpg",
	"Miguel de Cervantes": "https://zenquotes.io/img/miguel-de-cervantes.jpg",
	"Ming-Dao Deng": "https://zenquotes.io/img/ming--dao-deng.jpg",
	"Morgan Wootten": "https://zenquotes.io/img/morgan-wootten.jpg",
	"Mother Teresa": "https://zenquotes.io/img/mother-teresa.jpg",
	"Napoleon Hill": "https://zenquotes.io/img/napoleon-hill.jpg",
	"Naval Ravikant": "https://zenquotes.io/img/naval-ravikant.jpg",
	"Neil Barringham": "https://zenquotes.io/img/neil-barringham.jpg",
	"Nelson Mandela": "https://zenquotes.io/img/nelson-mandela.jpg",
	"Niccolo Machiavelli": undefined,
	"Nicolas Chamfort": "https://zenquotes.io/img/nicolas-chamfort.jpg",
	"Nikola Tesla": "https://zenquotes.io/img/nikola-tesla.jpg",
	"Norman Vaughan": "https://zenquotes.io/img/norman-vaughan.jpg",
	"Og Mandino": "https://zenquotes.io/img/og-mandino.jpg",
	"Oprah Winfrey": "https://zenquotes.io/img/oprah-winfrey.jpg",
	"Orison Swett Marden": "https://zenquotes.io/img/orison-swett-marden.jpg",
	"Oscar Wilde": "https://zenquotes.io/img/oscar-wilde.jpg",
	"Osho": "https://zenquotes.io/img/osho.jpg",
	"Paramahansa Yogananda": "https://zenquotes.io/img/paramahansa-yogananda.jpg",
	"Paulo Coelho": "https://zenquotes.io/img/paulo-coelho.jpg",
	"Pema Chodron": "https://zenquotes.io/img/pema-chodron.jpg",
	"Peter A. Cohen": "https://zenquotes.io/img/peter-a_-cohen.jpg",
	"Plato": "https://zenquotes.io/img/plato.jpg",
	"Publilius Syrus": "https://zenquotes.io/img/publilius-syrus.jpg",
	"Ralph Marston": "https://zenquotes.io/img/ralph-marston.jpg",
	"Ralph Waldo Emerson": "https://zenquotes.io/img/ralph-waldo-emerson.jpg",
	"Ray Bradbury": "https://zenquotes.io/img/ray-bradbury.jpg",
	"Richard Bach": "https://zenquotes.io/img/richard-bach.jpg",
	"Rita Mae Brown": "https://zenquotes.io/img/rita-mae-brown.jpg",
	"Robert Frost": "https://zenquotes.io/img/robert-frost.jpg",
	"Robert Greene": "https://zenquotes.io/img/robert-greene.jpg",
	"Robin Sharma": "https://zenquotes.io/img/robin-sharma.jpg",
	"Robin Williams": "https://zenquotes.io/img/robin-williams.jpg",
	"Roger Lee": undefined,
	"Rosa Nouchette Carey": "https://zenquotes.io/img/rosa-nouchette-carey.jpg",
	"Roy T. Bennett": "https://zenquotes.io/img/roy-t_-bennett.jpg",
	"Rumi": "https://zenquotes.io/img/rumi.jpg",
	"Samuel Beckett": "https://zenquotes.io/img/samuel-beckett.jpg",
	"Samuel Butler": "https://zenquotes.io/img/samuel-butler.jpg",
	"Sathya Sai Baba": "https://zenquotes.io/img/sathya-sai-baba.jpg",
	"Seneca": "https://zenquotes.io/img/seneca.jpg",
	"Seungsahn": undefined,
	"Shahir Zag": "https://zenquotes.io/img/shahir-zag.jpg",
	"Shunryu Suzuki": "https://zenquotes.io/img/shunryu-suzuki.jpg",
	"Sigmund Freud": "https://zenquotes.io/img/sigmund-freud.jpg",
	"Socrates": "https://zenquotes.io/img/socrates.jpg",
	"Sonia Ricotti": "https://zenquotes.io/img/sonia-ricotti.jpg",
	"Soren Kierkegaard": "https://zenquotes.io/img/soren-kierkegaard.jpg",
	"Soyen Shaku": "https://zenquotes.io/img/soyen-shaku.jpg",
	"St. Jerome": "https://zenquotes.io/img/st_-jerome.jpg",
	"Stephen Hawking": "https://zenquotes.io/img/stephen-hawking.jpg",
	"Stephen King": "https://zenquotes.io/img/stephen-king.jpg",
	"Steve Jobs": "https://zenquotes.io/img/steve-jobs.jpg",
	"Steve Maraboli": "https://zenquotes.io/img/steve-maraboli.jpg",
	"Sun Tzu": "https://zenquotes.io/img/sun-tzu.jpg",
	"Sydney Smith": "https://zenquotes.io/img/sydney-smith.jpg",
	"T.S. Eliot": "https://zenquotes.io/img/t_s_-eliot.jpg",
	"Theodore Roosevelt": "https://zenquotes.io/img/theodore-roosevelt.jpg",
	"Thich Nhat Hanh": "https://zenquotes.io/img/thich-nhat-hanh.jpg",
	"Thomas Edison": "https://zenquotes.io/img/thomas-edison.jpg",
	"Thomas Jefferson": "https://zenquotes.io/img/thomas-jefferson.jpg",
	"Tony Robbins": "https://zenquotes.io/img/tony-robbins.jpg",
	"Unknown": undefined,
	"Vidal Sassoon": "https://zenquotes.io/img/vidal-sassoon.jpg",
	"Vince Lombardi": "https://zenquotes.io/img/vince-lombardi.jpg",
	"Vincent van Gogh": "https://zenquotes.io/img/vincent-van-gogh.jpg",
	"Virginia Woolf": "https://zenquotes.io/img/virginia-woolf.jpg",
	"Voltaire": "https://zenquotes.io/img/voltaire.jpg",
	"W. Clement Stone": "https://zenquotes.io/img/w_-clement-stone.jpg",
	"W.P. Kinsella": "https://zenquotes.io/img/w_p_-kinsella.jpg",
	"Walt Disney": "https://zenquotes.io/img/walt-disney.jpg",
	"Walt Whitman": "https://zenquotes.io/img/walt-whitman.jpg",
	"Wayne Dyer": "https://zenquotes.io/img/wayne-dyer.jpg",
	"Wayne Gretzky": "https://zenquotes.io/img/wayne-gretzky.jpg",
	"Will Rogers": "https://zenquotes.io/img/will-rogers.jpg",
	"William Faulkner": "https://zenquotes.io/img/william-faulkner.jpg",
	"Winston Churchill": "https://zenquotes.io/img/winston-churchill.jpg",
	"Woody Allen": "https://zenquotes.io/img/woody-allen.jpg",
	"Yoko Ono": "https://zenquotes.io/img/yoko-ono.jpg",
	"Zen Proverb": "https://zenquotes.io/img/zen-proverb.jpg",
	"Zhuangzi": "https://zenquotes.io/img/zhuangzi.jpg",
	"Zig Ziglar": "https://zenquotes.io/img/zig-ziglar.jpg"
}

module.exports = fetchRandomQuote;