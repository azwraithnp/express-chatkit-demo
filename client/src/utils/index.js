const contractAddress = 'TRRLrKDhH13skjzwqLn9iRQ7VyDKeGojwD'

const utils = {
    tronWeb: false,
    contract: false,

    async setTronWeb(tronWeb) {
        this.tronWeb = tronWeb;
        this.contract = await tronWeb.contract().at(contractAddress)
    },

};

export default utils;

