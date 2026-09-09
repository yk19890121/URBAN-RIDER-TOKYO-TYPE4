# URBAN RIDER TOKYO TYPE4

「都市を駆ける、自由な魂へ。」をテーマにした、コミック／自主制作誌スタイルのグラフィックTシャツ販売サイトです。TOPと6コレクションページを静的HTMLとして生成します。

## 起動

Node.js 20以上。外部npm依存はありません。

```sh
npm run build
npm run verify
npm run dev
```

ローカル表示は `http://127.0.0.1:4173`、公開用ファイルは `dist/` です。

## ページ

- `/` TOP
- `/bike/` BIKE COLLECTION
- `/animal/` ANIMAL DESIGN COLLECTION
- `/gakusei/` GAKUSEI COLLECTION
- `/army/` ARMY COLLECTION
- `/dokuro/` DOKURO COLLECTION
- `/brand/` URBAN RIDER TOKYO BRAND COLLECTION

## データと素材

- `src/collections.mjs`: ブランドコンセプトとコピー
- `src/products.json`: 同梱Excelから抽出した99商品の名称、価格、SUZURI購入URL
- `src/assets.json`: TOP画像とブランド別ヒーロー／ギャラリー画像
- `src/focals.json`: 主被写体を守るクロップ位置
- `public/images/`: URTプロジェクトの許可素材から変換済みのWebP

商品購入、サイズ、在庫、決済はリンク先のSUZURIが扱います。ARMYは5商品、DOKUROは3商品で、架空商品を追加して6点へ水増ししていません。BRANDにはExcelに記載されたTシャツ以外の商品も含まれます。

## デザインと操作

背景 `#fffdf7`、黒 `#151515`、シアン `#00bde3`、黄色 `#ffe51c` を使用。斜めの太枠コマ、巨大なコンデンス見出し、余白中心の商品情報を組み合わせています。スマートフォンではコマを自然な順序へ積み直し、商品画像の高さを制限します。

BLENCI LAB: `L03`, `L15`, `F21`, `F22`, `C02`, `B04`, `I02`, `I09`, `G05`, `G10`, `C09`, `U08`, `U09`, `U13`, `N07`。動きを減らすOS設定とタッチ操作に対応しています。

## 公開

`main` ブランチへのpushでGitHub Actionsが検証とビルドを行い、GitHub Pagesへ公開します。
## 2026-09 画像・遷移改修

- `src/assets.json` は `top` / `hero` / `gallery` の3スロット。選定画像は `scripts/remap_assets.py` で元PNGからWebPと640px版へ変換します。
- コレクションページのギャラリーは横スクロール、非トリミング、ホバー拡大、クリック時ライトボックス。BRANDページにはギャラリーを出力しません。
- TOPから各ブランドページへは、クリック位置から広がるN07円形リビールで遷移します。`prefers-reduced-motion` では通常遷移です。
- 画像使用箇所は `node scripts/image_usage.mjs` で `docs/image-usage.md` に生成します。商品99点、価格、SUZURI購入URLは変更しません。
