'use strict';

let moment      = require('moment'),
    models      = require('../app/models/index.js');

let main = async () => {
    await models.sequelize.sync({force: true});
    await _generateUser();
    let kaijus = await _generateKaijus();
    await _generateAttacks(kaijus);
};

let _generateUser = async () => {
    await models.User.create({
        id: '00000000-0000-0000-0000-000000000000',
        nickname: 'ultraman',
        password: 'ultraman',
        token: '00000000-0000-0000-0000-000000000000'
    });
};

let _generateKaijus = async () => {
  let promises = [
      models.Kaiju.create({ name: 'ゴジラ', nameRomanji: 'Godzilla' }),
      models.Kaiju.create({ name: 'ガメラ', nameRomanji: 'Gamera' }),
      models.Kaiju.create({ name: 'モスラ', nameRomanji: 'Mothra' }),
      models.Kaiju.create({ name: 'キングギドラ', nameRomanji: 'King Ghidorah' }),
      models.Kaiju.create({ name: 'メカゴジラ', nameRomanji: 'Mechagodzilla' }),
  ];

  return await Promise.all(promises);
};

let _generateAttacks = async (kaijus) => {
   let tokyo = { type: 'Point', coordinates: [35.652832,139.839478] },
       osaka = { type: 'Point', coordinates: [34.69374,135.50218] };

   let promises = [
        models.Attack.create({ kaijus: [kaijus[0].id], beginAt: moment('2017-07-06 09:30:00').toDate(), finishAt: moment('2017-07-06 10:30:00').toDate(), location: tokyo, createdBy: '00000000-0000-0000-0000-000000000000' }),
       models.Attack.create({ kaijus: [kaijus[0].id, kaijus[4].id], beginAt: moment('2017-07-08 09:30:00').toDate(), finishAt: moment('2017-07-08 10:30:00').toDate(), location: tokyo, createdBy: '00000000-0000-0000-0000-000000000000' }),
       models.Attack.create({ kaijus: [kaijus[1].id, kaijus[2].id], beginAt: moment('2017-07-15 09:30:00').toDate(), finishAt: moment('2017-07-15 10:30:00').toDate(), location: osaka, createdBy: '00000000-0000-0000-0000-000000000000'})
   ];

   await Promise.all(promises);
};

main().then(() => {
    console.log('done !');
}).catch((err) => {
    console.error(err);
});
