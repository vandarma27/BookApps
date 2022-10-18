const bukus = [];
const RENDER_EVENT = 'render-buku';

document.addEventListener(RENDER_EVENT, function () {
    console.log(bukus);
    const unreadBukuList = document.getElementById('bukus');
    unreadBukuList.innerHTML = '';

    for (const bukuItem of bukus) {
        const bukuElement = makeBuku(bukuItem);
        unreadBukuList.append(bukuElement);
    }
})

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        tambahBuku();
    });
});

function tambahBuku() {
    const judulBuku = document.getElementById('judul').value;
    const penulisBuku = document.getElementById('penulis').value;
    const tahunTerbit = document.getElementById('tahun').value;
    const isRead = document.getElementById('read').checked;

    const generateID = generateId();
    const bukuObject = generateBukuObject(generateID, judulBuku, penulisBuku, tahunTerbit, isRead);
    bukus.push(bukuObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function generateId() {
    return +new Date();
}

function generateBukuObject(id, judul, penulis, tahun, isRead) {
    return {
        id,
        judul,
        penulis,
        tahun,
        isRead
    }
}

function makeBuku(bukuObject) {
    const textJudul = document.createElement('h2');
    textJudul.innerText = bukuObject.judul;

    const textPenulis = document.createElement('p')
    textPenulis.innerText = bukuObject.penulis;

    const textTahun = document.createElement('p')
    textTahun.innerText = bukuObject.tahun;

    const textContainer = document.createElement('div')
    textContainer.classList.add('inner');
    textContainer.append(textJudul, textPenulis, textTahun);

    const containerItem = document.createElement('div');
    containerItem.classList.add('item');
    containerItem.append(textContainer);
    containerItem.setAttribute('id', 'buku-${bukuObject.id}');

    if (bukuObject.isRead) {
        const unRead = document.createElement('button');
        unRead.classList.add('unRead-button');
        unRead.innerText = 'Belum Selesai Dibaca'

        unRead.addEventListener('click', function () {
            unReadBook(bukuObject.id);
        })

        containerItem.append(unRead);
    } else {
        const read = document.createElement('button');
        read.classList.add('read-button');
        read.innerText = 'Sudah Dibaca'

        read.addEventListener('click', function () {
            readBook(bukuObject.id);
        })

        containerItem.append(read);
    }

    const hapusButton = document.createElement('button');
    hapusButton.classList.add('hapus-button');
    hapusButton.innerText = 'Hapus Buku';

    hapusButton.addEventListener('click', function () {
        hapusBuku();
    })

    containerItem.append(hapusButton);

    return containerItem;
}