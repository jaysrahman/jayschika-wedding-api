// merujuk express, body-parser
const express = require('express');
const bodyParser = require('body-parser');

// instansiasi obejct express dan di simpan pada konstanta app
const app = express();

// gunakan body parser sebgai middleware
app.use(bodyParser.json());

// untuk sementara kita anggap variable db ini sebagai sumber data kita
// contoh data yang kita gunakan adalah job pada karakter game
let db = [
    {
        id: 1,
        nama: 'Asa',
        alamat: 'Bumen',
        pesan: 'Semoga lancar sampe hari H'
    },
    {
        id: 2,
        nama: 'Refa',
        alamat: 'Bumen',
        pesan: 'Selamat Aa, Semoga lancar sampe hari H'
    },
];

// contoh routing pada express
app.get('/', (request, response) => response.send('Hello World'));

// memberikan List job
app.get('/ucapan', (request, response) => {
    var fs = require('fs');

    fs.readFile('ucapan.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        // return response.json(data)
        db = JSON.parse(data); //now it an object
        return response.json(db);
        // db.push(newJob); //add some data
        // dbJson = JSON.stringify(db); //convert it back to json
        // fs.writeFile('ucapan.json', dbJson, 'utf8', function() {
        //     return response.json(newJob);
        // }); // write it back 
    }});
});

// memberikan job spesifik sesuai dengan nama yang ada pada url
app.get('/ucapan/:nama', (request, response) => {
    const result = db.filter(val => {
        return val.nama.toLocaleLowerCase() === request.params.nama.toLocaleLowerCase();
    });
    return response.json(result);
});

// memasukan job baru
app.post('/ucapan', (request, response) => {
    const newJob = {
        id: db.length + 1,
        nama: request.body.nama,
        alamat: request.body.alamat,
        pesan: request.body.pesan
    };

    // db.push(newJob);

    // var dbJson = JSON.stringify(db);

    var fs = require('fs');
    // fs.writeFile('ucapan.json', dbJson, 'utf8', function() {
    //     return response.json(newJob);
    // });

    fs.readFile('ucapan.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        db = JSON.parse(data); //now it an object
        db.push(newJob); //add some data
        dbJson = JSON.stringify(db); //convert it back to json
        fs.writeFile('ucapan.json', dbJson, 'utf8', function() {
            return response.json(newJob);
        }); // write it back 
    }});
});

// mengubah job yang ada
app.put('/ucapan/:nama', (request, response) => {
    const theJob = db.filter(val => {
        return val.nama.toLocaleLowerCase() === request.params.nama.toLocaleLowerCase();
    });

    if (theJob === null) {
        return response.json('Not Found');
    }

    const newJob = {
        id: theJob[0].id,
        nama: request.body.nama || theJob[0].nama,
        alamat: request.body.alamat || theJob[0].alamat,
        pesan: request.body.pesan || theJob[0].pesan
    };

    db.push(newJob);
    
    return response.json(newJob);
});

// menghapus job yang ada
app.delete('/ucapan/:nama', (request, response) => {
    db = db.filter(val => {
        return val.nama.toLocaleLowerCase() !== request.params.nama.toLocaleLowerCase();
    });

    return response.json(db);
});

// mendengarkan event yang terjadi pada localhost dengan port 3000
app.listen(process.env.PORT || 3000);