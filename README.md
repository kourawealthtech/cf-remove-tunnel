# Delete Tunnel Action for GitHub

Removes CloudFlare ZeroTrustTunnel by ID or name.

## Usage via Github Actions

```yaml
name: example
on:
  pull_request:
    type: [closed]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: kourawealthtech/cf-remove-tunnel@v1.0
        with:
          name: "some-tunnel-name"
          token: ${{ secrets.CLOUDFLARE_TOKEN }}
```

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE).
