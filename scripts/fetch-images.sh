#!/usr/bin/env bash
# Canlı sitedeki görselleri indirip projeye yerleştirir.
# Depoda yalnızca hero-master.webp mevcut; kalan 126 görsel bu script ile gelir.
#
# Kullanım:  bash scripts/fetch-images.sh
#
# NOT: Vite build'inde dosya adlarına hash eklendiği için canlıdaki adlar
# farklıdır. Aşağıdaki eşleme bunu çözer. Site yeniden deploy edilirse
# hash'ler değişir; o durumda canlı index.html/villa.html içinden güncelleyin.

set -euo pipefail

BASE="${BASE:-https://casa-vera-oasis.vercel.app}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/assets/img"

get() { # get <uzak-yol> <yerel-yol>
  mkdir -p "$(dirname "$OUT/$2")"
  printf '  %-34s → %s\n' "$1" "$2"
  curl -fsSL "$BASE/$1" -o "$OUT/$2"
}

echo "Tekil görseller:"
get "assets/hero-master-CWr8Hwhk.webp"  "hero-master.webp"
get "assets/logo-casa-vera-BSoTVHT5.png" "logo-casa-vera.png"
get "assets/logo-tmo-t-Vg5_zZYB.png"     "logo-tmo.png"
get "assets/teras-manzara-dnEk9msl.webp" "teras-manzara.webp"
get "assets/villa-bahce-QkIK_Ivp.webp"   "villa-bahce.webp"
get "assets/salon-K9IF4rzg.webp"         "salon.webp"
get "assets/havuz-yuzme-LU8Va0uG.webp"   "havuz-yuzme.webp"
get "assets/gece-giris-fu_OSFB5.webp"    "gece-giris.webp"
get "assets/yatak-odasi-DfCTxATK.webp"   "yatak-odasi.webp"
get "assets/mutfak-CUA8ZWij.webp"        "mutfak.webp"
get "assets/villa-aksam-CRUVyRNB.jpg"    "villa-aksam.jpg"

echo "Dış cephe (38 + thumb):"
for i in $(seq -w 1 38); do
  get "assets/img/dis/dis-$i.webp"       "dis/dis-$i.webp"
  get "assets/img/dis/thumb/dis-$i.webp" "dis/thumb/dis-$i.webp"
done

echo "İç dizayn (20 + thumb):"
for i in $(seq -w 1 20); do
  get "assets/img/ic/ic-$i.webp"         "ic/ic-$i.webp"
  get "assets/img/ic/thumb/ic-$i.webp"   "ic/thumb/ic-$i.webp"
done

echo
echo "Bitti. Toplam dosya: $(find "$OUT" -type f | wc -l) / 127"
