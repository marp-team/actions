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
const assert_1 = __importDefault(require("assert"));
const fs_1 = __importDefault(require("fs"));
const util_1 = __importDefault(require("util"));
const path_1 = __importDefault(require("path"));
const core_1 = require("@actions/core");
const github_1 = require("@actions/github");
const mime_types_1 = __importDefault(require("mime-types"));
const readdir = util_1.default.promisify(fs_1.default.readdir);
const stat = util_1.default.promisify(fs_1.default.stat);
const resolveFiles = (files) => __awaiter(void 0, void 0, void 0, function* () {
    const ret = [];
    for (const f of files.map((f) => path_1.default.resolve(process.cwd(), f))) {
        try {
            const fstat = yield stat(f);
            if (fstat.isFile()) {
                ret.push(f);
            }
            else if (fstat.isDirectory()) {
                ret.push(...(yield readdir(f, { withFileTypes: true }))
                    .filter((d) => !d.isDirectory())
                    .map((d) => path_1.default.resolve(f, d.name)));
            }
        }
        catch (e) {
            if (e.code !== 'ENOENT')
                throw e;
        }
    }
    return ret;
});
/**
 * Upload files to GitHub release for specified version.
 */
function upload(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const octokit = new github_1.GitHub(opts.token);
        const version = opts.version ||
            (() => {
                if (github_1.context.ref.startsWith('refs/tags/'))
                    return github_1.context.ref.slice(10);
                throw new Error('Release task failed to detect the target version.');
            })();
        const files = yield resolveFiles(opts.files);
        assert_1.default(files.length, 'Files for uploading are not found.');
        // Get existed release
        const { data } = yield octokit.repos.getReleaseByTag({
            owner: github_1.context.repo.owner,
            repo: github_1.context.repo.repo,
            tag: version,
        });
        // Upload files
        for (const f of files) {
            core_1.debug(`Uploading ${f}...`);
            const { size } = yield stat(f);
            yield octokit.repos.uploadReleaseAsset({
                file: fs_1.default.createReadStream(f),
                headers: {
                    'content-type': mime_types_1.default.lookup(f) || 'application/octet-stream',
                    'content-length': size,
                },
                name: path_1.default.basename(f),
                url: data.upload_url,
            });
        }
    });
}
exports.default = upload;
