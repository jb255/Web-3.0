import { promisify } from 'util';
import * as fs from "fs";
import { Logger, Controller, Get, Post, Param, Body} from '@nestjs/common';
import { AppService } from './app.service';

const hre = require("hardhat");
const assert = require("assert");
const axios = require("axios");

// File gestion utils
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

// check if file exists
const checkIfFileOrDirectoryExists = (path: string): boolean => {
  return fs.existsSync(path);
};

// delete file
const deleteFile = async (path: string): Promise<void> => {
  const unlink = promisify(fs.unlink);

  return await unlink(path);
};

// create file
const createFile = async (
  path: string,
  fileName: string,
  data: string,
): Promise<void> => {
  if (!checkIfFileOrDirectoryExists(path)) {
    fs.mkdirSync(path);
  }

  const writeFile = promisify(fs.writeFile);

  return await writeFile(`${path}/${fileName}`, data, 'utf8');
};
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async getHello(@Body() body: any): Promise<boolean> {
    await createFile('./contracts', 'CubeFusion.sol', body.code);

    try {
      // compile solidity contract received
      await hre.run("compile")
    } catch(error) {

      if (error == "HardhatError: HH600: Compilation failed") {
        await fs.rmSync('./artifacts', {recursive: true, force: true})
        await fs.rmSync('./cache', {recursive: true, force: true})
        return false
      }
    }
    
    // run test for contract

    var ret_test

    try {
      ret_test = await hre.run("test")
    } catch(error) {
      if (error == 'HardhatError: HH700: Artifact for contract "hardhat/console.sol:console" not found.') {
        await fs.rmSync('./artifacts', {recursive: true, force: true})
        await fs.rmSync('./cache', {recursive: true, force: true})
        return false
      }
    }

    await deleteFile('./contracts/CubeFusion.sol')
    await fs.rmSync('./artifacts', {recursive: true, force: true})
    await fs.rmSync('./cache', {recursive: true, force: true})

    if (ret_test) {
      return false
    } else {

      // NFT magic StartOn
      const http = await axios.create({
          baseURL: "https://api.starton.io/v2",
          headers: {
              "x-api-key": 'TPndfrkI7lXz5Xc3aXmyToqFRTyExidq',
          },
      })
      http.post('/smart-contract/binance-testnet/0x56d3338962455647AB2Bc209E137f36158e8f6BC/call',
          {
              "functionName": 'safeMint',
              "signerWallet": '0x39fE768e196fA27E6212524E6c93a83C9c3BbD7B',
              "speed": "low",
              "params": [
                  '0x44cc2d2bC9c8278194f3e30cBAaeD53F32639d9f', // address 0x0000000000000000000000000000000000000000
                  'QmYuwERMArRipSMN2FdUFXB7QwbB6BBkfHQvjkwuLfZvYp'
              ],

      }).then(response => { console.log(response.data) })
      return true
    }
  }
}
