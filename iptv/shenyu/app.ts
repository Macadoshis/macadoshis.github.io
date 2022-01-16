interface M3uEntry {
    name: string;
    logo: string;
    url: string;
    categories: { name: string, slug: string }[];
    countries: { name: string, code: string }[];
    languages: { name: string, code: string }[];
    tvg: { id: string, name: string, url: string };
}

function entryToM3u(entry: M3uEntry): string {
    let ret: string = '#EXTINF:-1';

    if (entry.logo) {
        ret += ` tvg-logo="${entry.logo}"`;
    }

    if (entry.tvg) {
        ret += ` tvg-id="${entry.tvg.id}"`;
        ret += ` tvg-name="${entry.tvg.name}"`;
        if (!entry.logo) {
            ret += ` tvg-logo="${entry.tvg.url}"`;
        }
    }

    if (entry.categories && entry.categories.length > 0) {
        ret += ` group-title="${entry.categories.map(c => c.name).join(";")}"`;
    }

    ret += ' ,' + entry.name;
    return ret;
}

async function main() {
    let fetch = require('node-fetch');
    let fsPromises = require('fs').promises;

    const response = await fetch("https://iptv-org.github.io/iptv/channels.json");

    if (response.status < 200 || response.status >= 300) {
        throw new Error("wrong status code");
    }

    const json: Array<M3uEntry> = await response.json();
    console.log(`successfully fetch iptv channels`);

    await fsPromises.rmdir("./dist", {recursive: true});
    console.log(`successfully deleted ./dist`);

    await fsPromises.mkdir("./dist");
    console.log(`successfully create ./dist`);

    let m3uALL: string[] = ['#EXTM3U'];
    let m3uFR: string[] = ['#EXTM3U'];

    json.forEach((entry: M3uEntry) => {
        console.info(entry.name);

        if (entry.countries && entry.countries.map(s => s.code).includes("FR")) {
            m3uFR.push(entryToM3u(entry));
            m3uFR.push(entry.url);
        }

        m3uALL.push(entryToM3u(entry));
        m3uALL.push(entry.url);
    });

    await fsPromises.writeFile('./dist/playlist-fr.m3u', m3uFR.join("\r\n"));
    await fsPromises.writeFile('./dist/playlist-all.m3u', m3uALL.join("\r\n"));

    console.info(m3uFR);
}

main();

