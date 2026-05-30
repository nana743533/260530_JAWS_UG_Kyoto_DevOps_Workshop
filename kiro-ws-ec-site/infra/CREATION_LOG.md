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
