const bukus = [];
const RENDER_EVENT = 'render-buku';
const SAVED_BOOK = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

function isStorageExist() {
    if (typeof(Storage)===undefined) {
        alert('browser tidak mendukung local storage');
        return false;
    }

    return true;
}

document.addEventListener(SAVED_BOOK, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
})

document.addEventListener(RENDER_EVENT, function () {
    const unreadBukuList = document.getElementById('bukus');
    unreadBukuList.innerHTML = '';

    const readBukuList = document.getElementById('read-bukus')
    readBukuList.innerHTML = '';

    for (const bukuItem of bukus) {
        const bukuElement = makeBuku(bukuItem);
        if (!bukuItem.isRead) {
            unreadBukuList.append(bukuElement);
        } else {
            readBukuList.append(bukuElement);
        }
    }
})

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        tambahBuku();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
      }
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
      for (const buku of data) {
        bukus.push(buku);
      }
    }
   
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

function tambahBuku() {
    const judulBuku = document.getElementById('judul').value;
    const penulisBuku = document.getElementById('penulis').value;
    const tahunTerbit = document.getElementById('tahun').value;
    const isRead = document.getElementById('read').checked;

    const generateID = generateId();
    const bukuObject = generateBukuObject(generateID, judulBuku, penulisBuku, tahunTerbit, isRead);
    bukus.push(bukuObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBook();
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
        hapusBuku(bukuObject.id);
        console.log("kepencet");
    })

    containerItem.append(hapusButton);

    return containerItem;
}

function readBook(bukuId) {
    const targetBuku = cariBuku(bukuId);

    if (tambahBuku == null) return;

    targetBuku.isRead = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBook();
}

function cariBuku(bukuId) {
    for (const bukuItem of bukus) {
        if (bukuItem.id == bukuId) {
            return bukuItem;
        }
    }
    return null;
}

function unReadBook(bukuId) {
    const targetBuku = cariBuku(bukuId);

    if (targetBuku == null) {
        return;
    }

    targetBuku.isRead = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBook();
}

function hapusBuku(bukuId) {
    const targetBuku = cariIndexBuku(bukuId);

    if (targetBuku === -1) {
        return;
    }

    bukus.splice(targetBuku,1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBook();
}

function cariIndexBuku(bukuId) {
    for (const index in bukus){
        if (bukus[index].id === bukuId) {
            return index;
        }
    }

    return -1;
}

function saveBook() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(bukus);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event (SAVED_BOOK));
    }
}