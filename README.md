# nestjs

## 项目启动

- npm install
- npm run start
  - 项目中连接数据库的信息存放在.env 文件中，请注意设置:
  ```
    DATABASE_HOST=localhost // 数据库主机地址
    DATABASE_PORT=3306  // 数据库端口号 - mysql默认3306
    DATABASE_NAME=databaseName  // 数据库名称
    DATABASE_USER=dabaseUser  // 数据库用户名
    DATABASE_PASSWORD=databasePassword  // 数据库密码
    API_KEY=34fdash8g943jigfo8fdfas // 控制守卫测试header拦截信息
  ```

## nest 指令

- 创建控制器: nest g co xxxController 【nest generate controller 缩写】
- 创建服务层: nest g s xxxService 【nest generate service 缩写】
- 创建 Module: nest g module test
- 忽略生成测试文件: --no-spec
- 创建 dto 文件: nest g class test/dto/create-coffee.dto
- 创建实体 entities: nest g class test/entities/floavor.entity --no-spec
- 迁移数据:
  - 创建迁移文件: npx typeorm migration:create -n CoffeeRefactor (数据库表、字段变更时维护之前的旧数据，否则会将旧数据全部丢弃)
  - 打包项目: npm run build (为了让 typeorm 找到配置等内容)
  - 运行迁移: npx typeorm migration:run
  - 回退迁移: npx typeorm migration:revert
  - 创建迁移(创建之前将修改好的项目先编译): npx typeorm migration:generate -n SchemaSync (表新增了字段，使用此自动创建对应的迁移文件，成功后在 migrations 中创建了 xxxSchemaSync.ts, 其中已自动写入了 up 与 down，可进行迁移(migration:run))【成功创建迁移后，应该重新 npm run build 编译文件，否则迁移的依旧是之前的一个 migration】
    - 完整流程: 【注意点: 1、迁移都执行最新的迁移文件 2、若在项目运行的情况下直接修改列名等，因为设置的自动同步数据库操作会将原先的列删除后重新创建新的列，导致原先数据丢失】
      - 修改 entities 实体
      - npm run build 编译修改后的项目
      - npx typeorm migration:generate -n xxxSync (自动创建迁移文件)
      - npm run build 编译创建好迁移文件之后的项目
      - npx typeorm migration:run (执行迁移)
      - npx typeorm migration:revert (撤回迁移)
- 创建过滤器: nest g filter common/filters/http-exception
- 创建控制守卫: nest g guard common/guards/api-key
- 创建拦截器: nest g interceptor common/interceptors/wrap-response
- 创建类中间件: nest g middleware common/middleware/logging

- 自动测试:
  - npm run test // 单元测试
  - npm run test:cov // 单元测试与收集测试覆盖率
  - npm run test:e2e // 端到端测试

## 修饰器

```
修饰器: https://juejin.cn/post/7076345952371015687
```

- @Get(String): 若不传递则为空, 如 http://localhost:3000 访问此内容

  - (静态匹配) @Get('name'): http://localhost:3000/name
  - (动态匹配) http://localhost:3000/123

    ```
      @Get(':id") {
        <!-- getDataById(@Param() params) {
          return `this is #${params.id} data`;
        } -->

        getDataById(@Param("id") id: string) {
          return `this is #${id} data`;
        }
      }
    ```

- @Post(String): 非等幂的，多次调用产生不同结果

  ```
    <!-- @Post()
    getPostData(@Body() body) {
      return body;
      // {name: '张三', age: 112}
    } -->
    @Post()
    getPostData(@Body('name') body) {
      return body;
      // 张三
    }

    http://localhost:3000/ {name: '张三', age: 112}
  ```

- @HttpCode(Number): 自定义接口状态码(最多为 999)

  ```
    @Post()
    @HttpCode(HttpStatus.NOT_FOUND) // 404,也可以直接写数字
    getPostData(@Body('name') body) {
      return body;
    }
  ```

- @Patch: patch 方式发送接口请求，用来处理局部更新数据操作(只更新传递部分的数据，不完全替换完整数据对象)

- @Put: 等幂，put 方式发送接口请求，用来更新完整数据对象(使用传递的数据替换),理论上说，如果使用 Put 但未提供完整 user,那么缺少部分字段应该被清空，且 put 会产生 create 操作，如果更新的 id 不存在则会进行创建

- @Delete: delete 方式发送接口请求，用来删除数据

- @Type(() => Number): 转化数据类型

- @IsOptional(): 标记属性为可选，=== null || === undefined 则忽略验证程序

- @IsPositive(): 是否大于零的整数

- @Index(): 定义索引，加快查询速度

- @Injectable({ scope: Scope.DEFAULT })

  - Scope.DEFAULT: 默认情况 - 单例，仅实例化一次
  - Scope.TRANSIENT: 瞬注 - 实例化两次
  - Scope.REQUEST: 每次被请求接口时注册，如请求 3 次此接口就会实例化 3 次
    - 冒泡式范围，如在 conffe.service.ts 中使用 REQUEST 模式，那么 coffee.controller.ts 也会在每次被请求时实例化
    - 冒泡的 coffee.controller 可以获取请求信息: @Inject(REQUEST) private readonly request: Request，但是此操作会大大降低性能，需注意使用

- @UsePipes(ValidationPipe): 管道、拦截器

  - @Module()中

    - providers: [
      AppService,
      {
      provide: APP_PIPE,
      useClass: ValidationPipe,
      },
      ],

  - controller 中: @Controller('coffee')

    - @UsePipes(ValidationPipe)

  - 特定函数中: @Get()

    - @UsePipes(ValidationPipe)

  - 参数中: @Body(ValidationPipe)

## 问题

- post、put、patch 的区别 (https://www.jianshu.com/p/bee85cf4e33a)

  - post 在 http 规范中是非等幂的，多次调用产生不同结果
  - put 是等幂的，多次调用创建的结果相同，put 虽然也是更新资源，但需要提供整个 user 对象，理论上说，如果使用 Put 但未提供完整 user,那么缺少部分字段应该被清空，且 put 会产生 create 操作，如果更新的 id 不存在则会进行创建
  - patch 用来局部更新资源,如只更新 user.name,不需要将整个 user 对象传递并更新，更新 id 不存在不会创建

- module 如何引入其他的资源提供文件
  useValue 注入资源:

  ```
    @Module({
      imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
      controllers: [CoffeeController],
      providers: [
        CoffeeService,
        { provide: COFFEE_BRANDS, useValue: ['buddy brew', 'nescafa'] }, // 这里添加了新的资源到module中
      ],
      exports: [CoffeeService],
    })
  ```

  useClass 注入资源:

  ```
    class ConfigService {}
    class DevelopmentConfigService {}
    class ProductionConfigService {}
    @Module({
      imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
      controllers: [CoffeeController],
      providers: [
        CoffeeService,
        { // 此处使用useClass注入，且根据不同环境注入不同service
          provide: ConfigService,
          useClass:
            process.env.NODE_ENV === 'development'
              ? DevelopmentConfigService
              : ProductionConfigService,
        },
        { provide: COFFEE_BRANDS, useValue: ['buddy brew', 'nescafa'] },
      ],
      exports: [CoffeeService],
    })
  ```

  useFactory 注入(优势: 本身可以传入其他数据源达到动态注入效果，而不像前两个提前写死了数据而注入):

  ```
    @Injectable()
    export class CoffeeBrandsFactory {
      create() {
        return ['buddy brew', 'nescafa'];
      }
    }

    @Module({
      imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
      controllers: [CoffeeController],
      providers: [
        CoffeeService,
        CoffeeBrandsFactory,  // 需要在此加入inject.CoffeeBrandsFactory,否则依旧会找不到
        {
          provide: COFFEE_BRANDS,
          useFactory: (brandsFactory: CoffeeBrandsFactory) =>
            brandsFactory.create(), // 使用inject中的CoffeeBrandsFactory的数据注入
          inject: [CoffeeBrandsFactory],  // 使用了CoffeeBrandsFactory作为依赖源
        },
      ],
      exports: [CoffeeService],
    })
  ```

  异步等待数据库连接后再实例化

  ```
    @Injectable()
    export class CoffeeBrandsFactory {
      create() {
        return ['buddy brew', 'nescafa', 'aaa'];
      }
    }

    @Module({
      imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
      controllers: [CoffeeController],
      providers: [
        CoffeeService,
        CoffeeBrandsFactory,
        {
          provide: COFFEE_BRANDS,
          useFactory: async (connection: Connection): Promise<string[]> => {
            const brandsFactory = await Promise.resolve(new CoffeeBrandsFactory()); // 在异步之后再进行实例化providers实例
            console.log('providers.async: ');
            return brandsFactory.create();
          },
          inject: [CoffeeBrandsFactory, Connection],
        },
      ],
      exports: [CoffeeService],
    })
  ```
