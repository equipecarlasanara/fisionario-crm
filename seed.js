const dbHelper = require('./database');

const SAMPLE=[
  {id:1,name:'Ana Paula',ig:'@anapaula',wpp:'11988881111',origem:'instagram',interesse:'Consulta inicial',stage:'novo',lastContact:'25/03/2026',dateAdded:'20/03/2026',hist:['Curtiu 3 posts seguidos','Mandou DM perguntando sobre o programa']},
  {id:2,name:'Carla Mendes',ig:'@carlam',wpp:'11977772222',origem:'whatsapp',interesse:'Programa completo',stage:'contato',lastContact:'17/03/2026',dateAdded:'17/03/2026',hist:['Entrou pelo link do WhatsApp','Respondeu mensagem de boas-vindas']},
  {id:3,name:'Juliana Reis',ig:'@jureis',wpp:'11966663333',origem:'instagram',interesse:'Acompanhamento mensal',stage:'proposta',lastContact:'10/03/2026',dateAdded:'05/03/2026',hist:['Clicou no link da bio','Pediu mais informações','Proposta enviada']},
  {id:4,name:'Fernanda Lima',ig:'@ferlima',wpp:'11955554444',origem:'formulario',interesse:'Consulta inicial',stage:'fechado',lastContact:'25/03/2026',dateAdded:'20/02/2026',hist:['Entrou pelo formulário','Fechou no primeiro contato']},
  {id:5,name:'Priscila Santos',ig:'@prisantos',wpp:'',origem:'instagram',interesse:'Não definido',stage:'perdido',lastContact:'20/03/2026',dateAdded:'02/03/2026',hist:['Viu story, perguntou valor','Sumiu após proposta']},
  {id:6,name:'Renata Costa',ig:'@renata_c',wpp:'11944445555',origem:'instagram',interesse:'Programa completo',stage:'contato',lastContact:'05/03/2026',dateAdded:'25/02/2026',hist:['Comentou no post']},
  {id:7,name:'Tatiane Moura',ig:'@tatiane.m',wpp:'11933336666',origem:'formulario',interesse:'Acompanhamento mensal',stage:'novo',lastContact:'24/03/2026',dateAdded:'24/03/2026',hist:['Entrou pelo formulário público']},
];

async function seed() {
  for (const lead of SAMPLE) {
    try {
      await dbHelper.insertLead(lead);
      console.log('Inserted:', lead.name);
    } catch (err) {
      console.error(err);
    }
  }
  console.log('Finished seeding.');
  process.exit(0);
}

seed();
