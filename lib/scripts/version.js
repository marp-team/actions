"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const unreleased = '## [Unreleased]';
const [date] = new Date().toISOString().split('T');
const version = `## v${process.env.npm_package_version} - ${date}`;
const changelog = path_1.default.resolve(process.cwd(), 'CHANGELOG.md');
const content = fs_1.default.readFileSync(changelog, 'utf8');
fs_1.default.writeFileSync(changelog, content.replace(unreleased, `${unreleased}\n\n${version}`));
