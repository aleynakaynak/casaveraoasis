# Casa Vera Oasis

Assos (Behramkale · Ayvacık · Çanakkale) villa projesinin tanıtım sitesi.
Vite ile derlenen iki sayfalık statik site.

Canlı: https://casa-vera-oasis.vercel.app

## Geliştirme

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ üretir
```

## Dosya düzeni

```
index.html          ana sayfa
villa.html          villa detay sayfası
css/style.css       ortak stiller
css/villa.css       villa detay sayfası stilleri
js/villa-data.js    TEK VERİ KAYNAĞI — pin konumları, arsa m², satılan villalar
js/main.js          ana sayfa davranışı
js/villa.js         villa detay sayfası davranışı
assets/img/         Vite'ın işlediği görseller (hero, logolar, galeri)
public/assets/img/  olduğu gibi kopyalanan villa görselleri (dis/ic + thumb)
dist/               build çıktısı
```

## Sık yapılan değişiklikler

Villa numaraları, haritadaki pin konumları ve satılan villalar **yalnızca**
`js/villa-data.js` içinde tanımlıdır:

- `HERO_POINTS` — her villanın kuşbakışı görsel üzerindeki `[soldan %, üstten %]` konumu
- `SOLD` — satışa çıkmayacak villa numaraları
- `UNNUMBERED_POINT` — numarası olmayan binanın konumu
- `PLOT_AREAS` — net arsa alanları

Villa görsellerinin sayısı değişirse `js/villa.js` içindeki `DIS_COUNT` /
`IC_COUNT` sabitlerini de güncelleyin.

> Hero kutusunun en-boy oranı görselin oranıyla (2048/1707) birebir aynı
> olmalıdır. Oran bozulursa yüzdeyle konumlanan pinler binaların üstünden
> kayar — `css/style.css` içindeki `.hero-image` kuralına dikkat edin.

## Yayına alma

Vercel projesi `casa-vera-oasis` bu depoya bağlıdır. Derleme ayarı
`vercel.json` içinde açıkça belirtilmiştir (`npm run build` → `dist`).


Production deployment branch: `main`.
