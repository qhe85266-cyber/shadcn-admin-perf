# shadcn-admin-perf (portfolio fork)

基于 [satnaing/shadcn-admin](https://github.com/satnaing/shadcn-admin) 的前端性能与体验优化作品集分支。原项目采用 MIT 许可证，Copyright Sat Naing。

A frontend performance and UX portfolio fork of [satnaing/shadcn-admin](https://github.com/satnaing/shadcn-admin), licensed under MIT, Copyright Sat Naing.

## 优化内容 / Changes

- 将运行时 Faker 替换为预生成 JSON：500 位用户（seed 67890）与 100 个任务（seed 12345）。Faker 仅作为开发依赖用于生成脚本；加载 JSON 时恢复 `Date` 对象。
  Replace runtime Faker with generated JSON (500 users, seed 67890; 100 tasks, seed 12345). Faker stays a devDependency; date strings become `Date` objects on import.
- 移除 Google Fonts 网络请求，默认使用系统字体。保留 Inter / Manrope 选项及中英文系统字体回退，FontProvider 仍可保存和重置字体偏好。
  Remove Google Fonts requests and default to system fonts, retaining Inter / Manrope options with system fallbacks and persisted font preferences.
- 表格和应用列表搜索输入即时响应；约 300ms 防抖后更新筛选与 URL，外部筛选变化会取消过期输入。
  Keep typing immediate; debounce table filtering and app search URL updates by 300ms, discarding stale input when external filters change.
- HTML 语言设为 `zh-CN`。主应用无需 Clerk 密钥；保留 Clerk 演示路由及缺少密钥时的提示页面。
  Set HTML language to `zh-CN`. The main app requires no Clerk keys; optional Clerk demo routes keep their missing-key screen.

## 运行 / Run

使用支持当前 Vite / Faker 版本的 Node.js（建议 Node 22.13+）与 pnpm。
Use Node.js 22.13+ and pnpm.

```sh
pnpm install
pnpm dev
pnpm build
pnpm generate:mocks
```

`generate:mocks` 会更新已提交的 JSON，无需在启动或构建时运行。固定种子与参考日期 `2026-01-01T00:00:00.000Z` 确保日期可复现。无需配置 Clerk 环境变量即可构建或访问主应用。

`generate:mocks` regenerates the checked-in JSON; it is unnecessary for normal development or builds. Fixed seeds and a fixed reference date (`2026-01-01T00:00:00.000Z`) make relative dates reproducible. Clerk environment variables are optional for builds and the main app.

## 构建体积 / Before & After

| 指标 / Metric                  | BEFORE（提供的基线 / supplied baseline） | AFTER（本地构建 / measured build） |
| ------------------------------ | ---------------------------------------- | ---------------------------------- |
| dist 总体积 / total            | ~3.4 MB                                  | 3,217,427 bytes (~3.22 MB)         |
| JavaScript 总体积 / total      | ~2.13 MB                                 | 1,906,421 bytes (~1.91 MB)         |
| JavaScript gzip 总体积 / total | ~672 KB                                  | 571,538 bytes (~571.54 KB)         |
| Faker-containing chunk         | ~477 KB (~172 KB gzip)                   | 已移除 / removed                   |
| Google Fonts                   | yes                                      | no                                 |
| HTML lang                      | en                                       | zh-CN                              |

测量方法：`pnpm build` 后使用 `du -sb dist`；遍历所有 `.js` 文件求字节总和；逐个 gzip（level 9）后求和。MB / KB 使用十进制。生成的数据仍占用部分 JS 体积。以上为构建体积，非 LCP 实测结果。

Method: after `pnpm build`, measure `du -sb dist`, sum all `.js` file sizes, and sum each file compressed individually with gzip level 9. MB / KB are decimal. Static mock data still contributes to JS size. These are build sizes, not measured LCP results.

验证结果写入 `/tmp/shadcn-metrics/after.json`（本地临时文件，不随仓库提交）。源码无 Faker 导入，构建 JS 未发现 `this.faker=e` 或所检查的航空机场定义特征，入口 HTML 无 Google Fonts 链接。

Verification is recorded in `/tmp/shadcn-metrics/after.json` (a local temporary artifact). No source Faker imports, checked Faker/airport bundle signatures, or Google Fonts links in the entry HTML remain.

## 许可 / License

保留原始 [MIT LICENSE](LICENSE)，Copyright (c) 2024 Sat Naing。qhe85266-cyber 的作品集修改不改变 MIT 许可。

The original [MIT LICENSE](LICENSE), Copyright (c) 2024 Sat Naing, is retained. Portfolio modifications by qhe85266-cyber do not change the MIT license.
