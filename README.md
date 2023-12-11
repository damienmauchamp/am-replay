# AM Replay

## Build

```bash
$ yarn build
# or
$ npm build
```

## pm2

```bash
$ pm2 start npm --name="<NAME>" -- <SCRIPT>
$ pm2 start npm --name="<NAME>" -- start -p <PORT>
# or 
$ pm2 start yarn --name="<NAME>" -- <SCRIPT>
$ pm2 start yarn --name="<NAME>" -- start -p <PORT>
```

Do not forget

```bash
$ pm2 save
$ pm2 startup
```

