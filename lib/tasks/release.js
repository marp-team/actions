"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const github_1 = require("@actions/github");
/**
 * Update GitHub release for specified version based on parsed contents from CHANGELOG.md.
 */
function release({ token, version: _version, preRelease = undefined, convertGitHubMention = true, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const octokit = (0, github_1.getOctokit)(token);
        const version = _version ||
            (() => {
                if (github_1.context.ref.startsWith('refs/tags/'))
                    return github_1.context.ref.slice(10);
                throw new Error('Release task failed to detect the target version.');
            })();
        const isPreRelease = preRelease !== undefined ? preRelease : version.startsWith('v0.0.');
        // Parse CHANGELOG.md
        const changelog = path_1.default.resolve(process.cwd(), 'CHANGELOG.md');
        const content = yield promises_1.default.readFile(changelog, 'utf8');
        const current = { parsing: false, body: '' };
        for (const line of content.split('\n')) {
            if (current.parsing) {
                if (line.startsWith('## ') || line === '---' || line === '</details>') {
                    current.parsing = false;
                }
                else {
                    current.body += `${line}\n`;
                }
            }
            else if (line.startsWith(`## ${version} - `)) {
                current.parsing = true;
            }
        }
        let body = current.body.trim();
        if (!body) {
            throw new Error(`Not found the content of release note for ${version}.`);
        }
        if (convertGitHubMention) {
            body = body.replace(/\[@([a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38})\]\(https?:\/\/github\.com\/\1\/?\)/gi, '@$1');
        }
        // Create GitHub release
        yield octokit.rest.repos.createRelease({
            body,
            name: version,
            owner: github_1.context.repo.owner,
            prerelease: isPreRelease,
            repo: github_1.context.repo.repo,
            tag_name: version,
        });
    });
}
exports.default = release;
