# インフラ構築ログ (Claude Code)

Claude Code を使用して AWS CDK プロジェクトを作成した記録です。

---

## 1. ディレクトリ作成

```bash
mkdir -p kiro-ws-ec-site/infra
mkdir -p kiro-ws-ec-site/infra/bin
mkdir -p kiro-ws-ec-site/infra/lib
```

## 2. プロジェクト設定ファイル作成

### `infra/package.json`

```bash
# 作成: Write ツールで新規作成
# 内容: aws-cdk-lib ^2.178.0, constructs ^10.4.0, typescript ~5.7.0
```

### `infra/tsconfig.json`

```bash
# 作成: Write ツールで新規作成
# 内容: target ES2020, module commonjs, strict 有効
```

### `infra/cdk.json`

```bash
# 作成: Write ツールで新規作成
# 内容: app エントリポイントを ts-node 経由で指定
```

## 3. CDK スタックファイル作成

### `infra/bin/infra.ts` — エントリポイント

```bash
# 作成: Write ツールで新規作成
# 内容: HostingStack と PipelineStack を us-west-2 でインスタンス化
#       PipelineStack に HostingStack の siteBucket と distribution を渡す
```

### `infra/lib/hosting-stack.ts` — 配信基盤

```bash
# 作成: Write ツールで新規作成
# 内容:
#   - S3 バケット (BlockPublicAccess.BLOCK_ALL, RemovalPolicy.DESTROY)
#   - CloudFront Distribution (OAC 経由、HTTPS リダイレクト)
#   - SPA フォールバック (403/404 → /index.html 200)
#   - CfnOutput x3 (BucketName, DistributionId, DistributionDomainName)
```

### `infra/lib/pipeline-stack.ts` — CI/CD パイプライン

```bash
# 作成: Write ツールで新規作成
# 内容:
#   - CodeCommit "workshop-repo" を参照 (fromRepositoryName)
#   - CodeBuild PipelineProject (STANDARD_7_0, nodejs: 20)
#   - BuildSpec: npm ci → npm run build → s3 sync → cloudfront invalidation
#   - IAM: S3 (PutObject/DeleteObject/ListBucket) + CloudFront (CreateInvalidation)
#   - CodePipeline V2, Full Clone (codeBuildCloneOutput: true)
```

## 4. 依存関係インストール

```bash
cd kiro-ws-ec-site/infra
npm install
```

```
# 結果: 正常終了、node_modules 生成
```

## 5. TypeScript 型チェック

```bash
npx tsc --noEmit
```

```
# 結果: エラーなし（出力なし = 成功）
```

## 6. CDK Synth（テンプレート生成確認）

```bash
npx cdk synth --quiet
```

```
# 結果:
# Successfully synthesized to .../infra/cdk.out
# Supply a stack id (EcSiteHostingStack, EcSitePipelineStack) to display its template.
```

## 7. 最終ファイル構成

```
infra/
├── bin/
│   └── infra.ts
├── lib/
│   ├── hosting-stack.ts
│   └── pipeline-stack.ts
├── cdk.json
├── tsconfig.json
├── package.json
└── package-lock.json
```

---

## 使用したツール

| ステップ | Claude Code ツール | 目的 |
|---------|-------------------|------|
| ディレクトリ作成 | Bash (`mkdir -p`) | infra/, bin/, lib/ の作成 |
| ファイル作成 x6 | Write | 各設定ファイル・スタックファイルの新規作成 |
| npm install | Bash | 依存関係のインストール |
| 型チェック | Bash (`npx tsc --noEmit`) | TypeScript コンパイルエラーがないか確認 |
| テンプレート生成 | Bash (`npx cdk synth`) | CloudFormation テンプレートが正常に生成されるか確認 |

## 指示内容（ユーザーからの要件）

- リージョン: us-west-2
- S3: パブリックアクセス全ブロック
- CloudFront: OAC 経由、SPA フォールバック (403/404 → /index.html)
- CfnOutput: バケット名、ディストリビューション ID、配信ドメイン
- CI/CD: CodeCommit → CodeBuild → S3 sync + CloudFront invalidation
- CodePipeline V2、Full Clone
- CodeBuild: runtime-versions で nodejs: 20 を明示
- IAM: 対象バケットとディストリビューションに絞った最小権限

---

# ユニットテスト導入ログ (Claude Code)

Vitest を導入し、優先度の高いテスト（pricing.js / CartContext）を作成した記録です。

---

## 1. Vitest および関連ライブラリのインストール

```bash
cd kiro-ws-ec-site
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

```
# 結果: added 83 packages（正常終了）
```

## 2. package.json にテストスクリプト追加

```bash
# 変更: Edit ツールで既存ファイルを編集
# 追加内容:
#   "test": "vitest",
#   "test:run": "vitest run"
```

## 3. vite.config.js にテスト設定追加

```bash
# 変更: Edit ツールで既存ファイルを編集
# 追加内容:
#   test: {
#     environment: 'jsdom',
#     globals: true,
#     setupFiles: './tests/setup.js',
#   }
```

## 4. テストセットアップファイル作成

### `tests/setup.js`

```bash
# 作成: Write ツールで新規作成
# 内容: @testing-library/jest-dom/vitest をインポート
```

## 5. テストファイル作成

### `tests/unit/pricing.test.js` — 価格計算ロジック（最優先）

```bash
# 作成: Write ツールで新規作成
# テスト内容:
#   - calculateTax: 端数なし、端数あり（切り捨て期待）、0円、大きい金額
#   - calculateShipping: 閾値境界値（4999/5000/5001円）、0円
#   - calculateTotal: 送料無料域/有料域の組み合わせ
# テスト数: 15
```

### `tests/unit/cart-reducer.test.jsx` — カート状態管理（最優先）

```bash
# 作成: Write ツールで新規作成
# テスト内容:
#   - addToCart: 新規追加、同一商品の数量加算、異なる商品追加、デフォルト数量
#   - removeFromCart: 正常削除、存在しないID
#   - updateQuantity: 数量変更、0で削除、負数で削除
#   - clearCart: 全件削除
#   - cartCount: 数量合計、空カート
#   - cartTotal: 金額合計、空カート、数量更新後の再計算
# テスト数: 15
```

## 6. テスト実行

```bash
npm run test:run
```

```
# 結果:
#   tests/unit/pricing.test.js      — 15 tests | 12 passed | 3 failed
#   tests/unit/cart-reducer.test.jsx — 15 tests | 15 passed | 0 failed
#   合計: 30 tests | 27 passed | 3 failed
```

## 7. 検出されたバグ

### `calculateTax` が `Math.ceil`（切り上げ）を使用している

| 入力 | 期待値 (Math.floor) | 実際の値 (Math.ceil) | 差額 |
|------|---------------------|---------------------|------|
| 999円 | 99円 | 100円 | +1円 |
| 101円 | 10円 | 11円 | +1円 |
| 1円 | 0円 | 1円 | +1円 |

ソースコード内のコメントにも「バグ」と記載されており、テストで再現を確認。
ユーザー指示により修正は行わず、テスト失敗として記録に残す。

## 8. 最終ファイル構成

```
tests/
├── setup.js
└── unit/
    ├── pricing.test.js
    └── cart-reducer.test.jsx
```

## 使用したツール

| ステップ | Claude Code ツール | 目的 |
|---------|-------------------|------|
| ライブラリインストール | Bash (`npm install -D`) | vitest, testing-library 等の導入 |
| スクリプト追加 | Edit | package.json に test/test:run 追加 |
| Vite 設定変更 | Edit | vite.config.js にテスト環境設定追加 |
| ディレクトリ作成 | Bash (`mkdir -p`) | tests/unit/ の作成 |
| ファイル作成 x3 | Write | setup.js, pricing.test.js, cart-reducer.test.jsx |
| テスト実行 | Bash (`npm run test:run`) | テストの実行と結果確認 |

## 指示内容（ユーザーからの要件）

- Vitest を導入し、優先度の高いもの（pricing.js, CartContext）のユニットテストを書く
- package.json に test スクリプトを追加
- バグを見つけても修正しない（テスト失敗として記録に残す）
