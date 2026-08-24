# Casa Vera Oasis

Assos (Behramkale / Ayvacık / Çanakkale) villa projesinin tanıtım sitesi.
Derleme adımı yoktur — düz statik site (HTML + CSS + ES modülleri).

Canlı: https://casa-vera-oasis.vercel.app

## Yerelde çalıştırma

```bash
python3 -m http.server 8000
# http://localhost:8000
```

Statik sunucu şart: sayfa ES modülü kullandığı için dosyayı doğrudan
`file://` ile açmak çalışmaz.

## Dosya düzeni

```
index.html          ana sayfa
villa.html          villa detay sayfası
css/main.css        ortak stiller + değişkenler
css/villa.css       villa detay sayfası stilleri
js/villa-data.js    TEK VERİ KAYNAĞI — pin konumları, arsa m², satılanlar
js/main.js          ana sayfa davranışı
js/villa.js         villa detay sayfası davranışı
assets/img/         görseller
scripts/fetch-images.sh   canlı siteden görselleri indirir
```

Villa numaraları, harita üzerindeki pin konumları ve satılan villalar
**yalnızca `js/villa-data.js` içinde** tanımlıdır. Değişiklik gerektiğinde
başka dosyaya dokunmaya gerek yoktur.

## Görseller

Depoda şu an yalnızca `assets/img/hero-master.webp` var. Kalan 126 görsel
canlı siteden indirilmelidir:

```bash
bash scripts/fetch-images.sh
```

Beklenen yapı (toplam 127 dosya):

| Yol | Adet |
|---|---|
| `assets/img/hero-master.webp` | 1 |
| `assets/img/logo-casa-vera.png`, `logo-tmo.png` | 2 |
| `assets/img/{teras-manzara,villa-bahce,salon,havuz-yuzme,gece-giris,yatak-odasi,mutfak}.webp` | 7 |
| `assets/img/villa-aksam.jpg` | 1 |
| `assets/img/dis/dis-01..38.webp` + `dis/thumb/` | 76 |
| `assets/img/ic/ic-01..20.webp` + `ic/thumb/` | 40 |

Görsel sayısını değiştirirseniz `js/villa.js` içindeki `SETS` sabitini de
güncelleyin (`dis: 38`, `ic: 20`).

## Yayına alma

Vercel projesi `casa-vera-oasis`, bu depoya bağlıdır. Derleme ayarı
gerekmez — framework yok, çıktı dizini deponun kökü.

> Görseller eksikken deploy etmeyin; site görselsiz yayına girer.
