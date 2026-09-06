export async function onRequest(context) {
  const { request, env } = context;
  let url = new URL(request.url);
  let domainBackend = ['worker-cf-skc.0u-ts0goso.workers.dev'];
  if (env.HOST) domainBackend = await ADD(env.HOST);
  let pathUji = env.PATH || '/';
  if (pathUji.charAt(0) !== '/') pathUji = '/' + pathUji;
  let kodeRespon = env.CODE || '200';

  async function getValidResponse(request, hosts) {
    let shuffledHosts = hosts.sort(() => Math.random() - 0.5);
    for (const host of shuffledHosts) {
      let testUrl = new URL(url.href); testUrl.hostname = host;
      testUrl.pathname = pathUji.split('?')[0]; testUrl.search = pathUji.split('?')[1] || '';
      try {
        const response = await fetch(testUrl.href, { method: 'HEAD', redirect: 'manual' });
        if (response.status.toString() === kodeRespon || response.status === 302) {
          let finalUrl = new URL(url.href); finalUrl.hostname = host;
          return await fetch(new Request(finalUrl.href, { method: request.method, headers: new Headers(request.headers), body: request.body, redirect: 'follow' }));
        }
      } catch (error) {}
    }
    return new Response('Down', { status: 503 });
  }

  return await getValidResponse(request, domainBackend);
}

async function ADD(envadd) {
  var addtext = envadd.replace(/[\t |"'\`\r\n]+/g, ',').replace(/,+/g, ',');
  if (addtext.charAt(0) == ',') addtext = addtext.slice(1);
  if (addtext.charAt(addtext.length - 1) == ',') addtext = addtext.slice(0, -1);
  return addtext.split(',');
}
