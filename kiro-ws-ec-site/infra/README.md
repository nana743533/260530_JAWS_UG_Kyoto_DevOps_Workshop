# EC サイト インフラ (AWS CDK)

Vite + React の EC サイトを AWS 上で配信するための CDK プロジェクトです。

## アーキテクチャ

```
┌─────────────┐     push      ┌──────────────┐
│ CodeCommit  │──────────────▶│ CodePipeline │
│ workshop-repo│   (main)     │     (V2)     │
└─────────────┘               └──────┬───────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │  CodeBuild   │
                              │  nodejs: 20  │
                              │  npm ci      │
                              │  npm run build│
                              └──────┬───────┘
                                     │
                          ┌──────────┴──────────┐
                          ▼                     ▼
                   ┌────────────┐     ┌──────────────────┐
                   │  S3 Bucket │     │ CloudFront       │
                   │ (dist sync)│     │ (invalidation)   │
                   └─────┬──────┘     └────────┬─────────┘
                         │                     │
                         └────────┬────────────┘
                                  │ OAC
                                  ▼
                         ┌────────────────┐
                         │   ユーザー      │
                         │ (HTTPS アクセス)│
                         └────────────────┘
```

## スタック構成

| スタック名 | 役割 |
|-----------|------|
| `EcSiteHostingStack` | S3 + CloudFront による静的サイト配信基盤 |
| `EcSitePipelineStack` | CodePipeline V2 + CodeBuild による CI/CD |

### EcSiteHostingStack（配信基盤）

| リソース | 設定 |
|---------|------|
| S3 バケット | パブリックアクセス全ブロック、RemovalPolicy: DESTROY |
| CloudFront Distribution | OAC 経由で S3 にアクセス、HTTPS リダイレクト |
| SPA フォールバック | 403/404 → `/index.html` (HTTP 200) |
| CfnOutput | バケット名、ディストリビューション ID、配信ドメイン名 |

### EcSitePipelineStack（CI/CD パイプライン）

| リソース | 設定 |
|---------|------|
| ソース | CodeCommit `workshop-repo` / `main` ブランチ、Full Clone |
| パイプライン | CodePipeline V2 |
| ビルド環境 | STANDARD_7_0 イメージ、SMALL コンピュートタイプ |
| Node.js | runtime-versions で 20 を明示指定（Vite 7 要件） |
| ビルド手順 | `npm ci` → `npm run build` |
| デプロイ手順 | `aws s3 sync dist/ s3://... --delete` → CloudFront invalidation |
| IAM 権限 | S3 (PutObject, DeleteObject, ListBucket) + CloudFront (CreateInvalidation) のみ |

## ファイル構成

```
infra/
├── bin/
│   └── infra.ts            # CDK アプリのエントリポイント
├── lib/
│   ├── hosting-stack.ts    # 配信基盤スタック
│   └── pipeline-stack.ts   # CI/CD パイプラインスタック
├── cdk.json                # CDK 設定
├── tsconfig.json           # TypeScript 設定
└── package.json            # 依存関係
```

## 前提条件

- AWS CLI が設定済み（`aws configure` または環境変数）
- Node.js 20 以上
- CodeCommit に `workshop-repo` リポジトリが作成済み
- `workshop-repo` の `main` ブランチに `kiro-ws-ec-site/` ディレクトリが含まれていること

## デプロイ手順

```bash
cd kiro-ws-ec-site/infra

# 依存関係のインストール
npm install

# CDK Bootstrap（初回のみ、us-west-2）
npx cdk bootstrap aws://<ACCOUNT_ID>/us-west-2

# テンプレート生成確認
npx cdk synth

# デプロイ（2スタックまとめて）
npx cdk deploy --all --require-approval broadening
```

## デプロイ後の確認

デプロイ完了後、以下の CfnOutput が表示されます。

```
EcSiteHostingStack.BucketName = ec-site-hosting-xxxxx
EcSiteHostingStack.DistributionId = E1XXXXXXXXXX
EcSiteHostingStack.DistributionDomainName = d1234abcdef.cloudfront.net
```

`DistributionDomainName` の URL でサイトにアクセスできます。

## 削除手順

```bash
npx cdk destroy --all
```

## リージョン

全リソースは `us-west-2` にデプロイされます。
