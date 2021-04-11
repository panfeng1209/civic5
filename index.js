const launch = require('./main/puppeteer');

const glca = require('./config/glca');
const gla = require('./config/gla');
const haw = require('./config/haw');

const resolveData = ({ datas, selector }) => datas.map(i => ({ url: i, selector }))

const go = async () => {
  const args = process.argv.splice(2);
  const [ hideX ] = args;
  const tabs = 6;
  const datas = [
    ...resolveData(gla),
    ...resolveData(glca),
    ...resolveData(haw),
  ];
  launch(datas, hideX, tabs);
}

go();
