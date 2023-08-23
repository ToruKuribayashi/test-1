import * as args from './microcms/microcms-args.js';
import { MicroCmsApiClient, HtmlConvertTool, ObjectParseTool } from './microcms/microcms-tools.js';

$(function() {
    const client = new MicroCmsApiClient(args.ServiceDomain, args.ApiKey);
    const parser = new ObjectParseTool();
    const fields = ['id', 'tag', 'title', 'content','publishedAt'];
    const htconv = new HtmlConvertTool(fields, {
        title: 'escape', publishedAt: 'dateFormat', tag: 'arrayFirst'});

    const query = parser.parseQuery(window.location.search);
    let filterStr = `id[equals]${query.id}`;
    client.getList(
        'news', fields.join(','), filterStr, '', 1
    ).then((res) => {
        const title = htconv.toHtml($('title').html(), res.contents);
        $('title').html(title);
        const html = htconv.toHtml($("#main_news_item").html(), res.contents);
        $("#main_news_item").html(html);
    });
    
    setTimeout(() => { $("#loading").addClass('loaded'); }, 500);
});
