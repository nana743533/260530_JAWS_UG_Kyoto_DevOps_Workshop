# JAWS UG Kyoto DevOps Workshop

AWS CDK を使って Lambda 関数をデプロイするサンプルプロジェクト。

---

## プロジェクト構成

```
.
├── bin/
│   └── cdk-app.ts          # CDK アプリのエントリポイント
├── lib/
│   └── cdk-stack.ts        # Lambda 関数を定義する Stack
├── lambda/
│   └── hello.ts            # Lambda 関数の本体（実行コード）
├── package.json            # npm 依存関係の定義
├── tsconfig.json           # TypeScript のコンパイル設定
└── cdk.json                # CDK の実行設定
```

---

## 各ファイルの解説

### 1. `bin/cdk-app.ts` — CDK アプリの入り口

```typescript
import * as cdk from 'aws-cdk-lib';
import { CdkStack } from '../lib/cdk-stack';

const app = new cdk.App();
new CdkStack(app, 'JawsUgKyotoWorkshopStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
```

| 処理 | 説明 |
|------|------|
| `new cdk.App()` | CDK アプリケーションを作成。これが全ての起点 |
| `new CdkStack(app, ...)` | 先ほど作った Stack をアプリに登録 |
| `env` | デプロイ先の AWS アカウント・リージョンを指定。<br>`CDK_DEFAULT_ACCOUNT` / `CDK_DEFAULT_REGION` は現在の AWS プロファイルから自動取得 |

**役割**: アプリ全体を初期化し、どの Stack を使うかを宣言するだけのシンプルなファイル。

---

### 2. `lib/cdk-stack.ts` — AWS リソースの定義

```typescript
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import { Construct } from 'constructs';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new lambda.Function(this, 'HelloFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'hello.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '..', 'lambda')),
      architecture: lambda.Architecture.ARM_64,
      description: 'JAWS UG Kyoto DevOps Workshop sample function',
    });
  }
}
```

**クラス構造**: `CdkStack` は `cdk.Stack` を継承しています。Stack とは「CloudFormation のスタック 1 つ」に相当する単位です。

| プロパティ | 値 | 説明 |
|-----------|-----|------|
| `runtime` | `NODEJS_22_X` | Lambda の実行環境。Node.js 22 を使用 |
| `handler` | `hello.handler` | ファイル名が `hello.ts`、エクスポート名が `handler` なので `hello.handler` と指定 |
| `code` | `lambda.Code.fromAsset(...)` | `lambda/` ディレクトリを ZIP 圧縮して Lambda にアップロード |
| `architecture` | `ARM_64` | ARM (Graviton) プロセッサを指定。x86 より安価で高性能 |

**役割**: 「どの Lambda 関数を、どんな設定で作るか」を TypeScript のコードで宣言している。

---

### 3. `lambda/hello.ts` — Lambda 関数の本体

```typescript
export const handler = async (event: any): Promise<any> => {
  console.log('Event:', JSON.stringify(event, null, 2));

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Hello from JAWS UG Kyoto DevOps Workshop!',
      timestamp: new Date().toISOString(),
    }),
  };
};
```

| 要素 | 説明 |
|------|------|
| `export const handler` | Lambda が呼び出す関数。名前を `handler` にすることで AWS がエントリポイントと認識 |
| `event` | Lambda を呼び出したときの入力（API Gateway のリクエストや S3 イベントなど） |
| 戻り値 | HTTP レスポンス形式。`statusCode` / `headers` / `body` を返す |
| `console.log` | CloudWatch Logs に出力される |

**この関数の動作**: 呼ばれると `{ message: "Hello from JAWS UG Kyoto DevOps Workshop!", timestamp: "..." }` という JSON を返す。

---

### 4. `cdk.json` — CDK の実行設定

```json
{
  "app": "npx ts-node --prefer-ts-exts bin/cdk-app.ts"
}
```

`cdk deploy` や `cdk synth` を実行したときに、どのコマンドでアプリを起動するかを指定している。ここでは `npx ts-node` で TypeScript を直接実行している。

---

### 5. `tsconfig.json` — TypeScript のコンパイル設定

| 設定 | 値 | 説明 |
|------|-----|------|
| `target` | `ES2020` | 出力する JavaScript のバージョン |
| `module` | `commonjs` | Node.js 向けのモジュール形式 |
| `outDir` | `./dist` | コンパイル結果の出力先 |
| `strict` | `true` | 厳格な型チェックを有効化 |

---

### 6. `package.json` — npm パッケージ管理

| パッケージ | 役割 |
|-----------|------|
| `aws-cdk-lib` | CDK のコアライブラリ。Lambda, S3, IAM など全ての AWS リソース定義を含む |
| `constructs` | CDK の基本クラス（Construct）を提供 |
| `typescript` | TypeScript コンパイラ |
| `@types/node` | Node.js の型定義 |

---

## CDK の 3 大概念

```
App（アプリケーション）
  └── Stack（スタック = CloudFormation スタック）
        └── Construct（構成品目 = Lambda, S3, IAM ロールなど）
```

| 概念 | 説明 | 今回の例 |
|------|------|---------|
| **App** | CDK アプリ全体。1 プロジェクトに 1 つ | `bin/cdk-app.ts` で作成 |
| **Stack** | デプロイ単位。CloudFormation スタックに対応 | `CdkStack` |
| **Construct** | AWS リソース 1 つを表す部品 | `new lambda.Function(...)` |

CDK の便利な点は、`new lambda.Function(...)` と書くだけで、IAM ロールや Lambda 関数の CloudFormation リソースが自動生成されること。

---

## デプロイの流れ

```
コードを書く → cdk synth → cdk bootstrap（初回のみ） → cdk deploy
```

| コマンド | 説明 |
|---------|------|
| `cdk synth` | コードを CloudFormation テンプレート（JSON/YAML）に変換。実際の AWS リソースは作らない |
| `cdk bootstrap` | CDK 用の S3 バケットなどを AWS アカウントに準備（初回のみ 1 回実行） |
| `cdk deploy` | 実際に AWS にリソースを作成・更新する |
| `cdk destroy` | 作成したリソースを全て削除する |

---

## 変更のカスタマイズ例

Lambda のコードを変更するだけで、中身を変えられます。

```typescript
// lambda/hello.ts の message を変えれば、デプロイ後に反映される
message: 'Hello from Workshop!',
```

```typescript
// lib/cdk-stack.ts でメモリやタイムアウトを追加することも可能
memorySize: 512,
timeout: cdk.Duration.seconds(30),
```
