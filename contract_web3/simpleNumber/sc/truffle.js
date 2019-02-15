module.exports = {
    networks: {
        live:{
            host:"127.0.0.1",
            port:8545,
            network_id: 169,       // Custom network
            gas: 3500000,           // Gas sent with each transaction (default: ~6700000)

            from:"0x77eae2d7680f2af9c1d4b3aaa5fb59242bae1b08",        // Account to send txs from (default: accounts[0])

        }
    }
}