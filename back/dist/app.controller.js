"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const util_1 = require("util");
const fs = require("fs");
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const hre = require("hardhat");
const assert = require("assert");
const axios = require("axios");
const checkIfFileOrDirectoryExists = (path) => {
    return fs.existsSync(path);
};
const deleteFile = async (path) => {
    const unlink = (0, util_1.promisify)(fs.unlink);
    return await unlink(path);
};
const createFile = async (path, fileName, data) => {
    if (!checkIfFileOrDirectoryExists(path)) {
        fs.mkdirSync(path);
    }
    const writeFile = (0, util_1.promisify)(fs.writeFile);
    return await writeFile(`${path}/${fileName}`, data, 'utf8');
};
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    async getHello(body) {
        await createFile('./contracts', 'CubeFusion.sol', body.code);
        try {
            await hre.run("compile");
        }
        catch (error) {
            if (error == "HardhatError: HH600: Compilation failed") {
                await fs.rmSync('./artifacts', { recursive: true, force: true });
                await fs.rmSync('./cache', { recursive: true, force: true });
                return false;
            }
        }
        var ret_test;
        try {
            ret_test = await hre.run("test");
        }
        catch (error) {
            if (error == 'HardhatError: HH700: Artifact for contract "hardhat/console.sol:console" not found.') {
                await fs.rmSync('./artifacts', { recursive: true, force: true });
                await fs.rmSync('./cache', { recursive: true, force: true });
                return false;
            }
        }
        await deleteFile('./contracts/CubeFusion.sol');
        await fs.rmSync('./artifacts', { recursive: true, force: true });
        await fs.rmSync('./cache', { recursive: true, force: true });
        if (ret_test) {
            return false;
        }
        else {
            const http = await axios.create({
                baseURL: "https://api.starton.io/v2",
                headers: {
                    "x-api-key": 'TPndfrkI7lXz5Xc3aXmyToqFRTyExidq',
                },
            });
            http.post('/smart-contract/binance-testnet/0x56d3338962455647AB2Bc209E137f36158e8f6BC/call', {
                "functionName": 'safeMint',
                "signerWallet": '0x39fE768e196fA27E6212524E6c93a83C9c3BbD7B',
                "speed": "low",
                "params": [
                    '0x44cc2d2bC9c8278194f3e30cBAaeD53F32639d9f',
                    'QmYuwERMArRipSMN2FdUFXB7QwbB6BBkfHQvjkwuLfZvYp'
                ],
            }).then(response => { console.log(response.data); });
            return true;
        }
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getHello", null);
AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map