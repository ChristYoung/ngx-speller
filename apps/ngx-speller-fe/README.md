# Angular Material Icon地址
 - https://jossef.github.io/material-design-icons-iconfont/

# 同步数据到FireBase
- https://developers.google.cn/codelabs/building-a-web-app-with-angular-and-firebase?hl=zh-cn#10
- https://console.firebase.google.com/project/speller-d44b7/authentication/users?hl=zh-cn (我的firebase配置)
- https://www.youtube.com/watch?v=QZlV3029dFk
- https://github.com/angular/angularfire/blob/master/docs/database.md (Real Time database)
- https://www.youtube.com/watch?v=586O934xrhQ (Fire base auth)

# 使用ngx-env配置Angular读取.env中的环境变量
 - https://www.npmjs.com/package/@ngx-env/builder

# 如何将Azure text to speech集成到Angular网页项目中
 - [创建Azure账户](https://azure.microsoft.com/zh-cn/pricing/purchase-options/azure-account?icid=ai-services)
 - [创建语音资源](https://portal.azure.com/#create/Microsoft.CognitiveServicesSpeechServices)
 - [文档](https://learn.microsoft.com/zh-cn/azure/ai-services/speech-service/get-started-text-to-speech?pivots=programming-language-javascript&tabs=macos%2Cterminal)
 - [Github samples for browser(已克隆到本地christYoungGitHub中)](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/quickstart/javascript/browser/text-to-speech/README.md)

# github action 如何配置secret.ACCESS_TOKEN
- https://blog.csdn.net/ht370671963/article/details/111995883

# Angular项目如何配置eslint
 - ng add @angular-eslint/schematics (如何后续更新Angular版本的话, 也需要执行相应的ng update @angular-eslint/schematics)

# Angular项目如何配置prettier
 - npm install --save-dev prettier
 - create a .prettierrc file in your project root
 - add "prettier" to your package.json scripts
 - npm install prettier-eslint eslint-config-prettier eslint-plugin-prettier -D
 - 在eslint.json配置文件的extends中添加"plugin:prettier/recommended"
