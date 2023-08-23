import * as args from './microcms/microcms-args.js';
import { MicroCmsApiClient, HtmlConvertTool } from './microcms/microcms-tools.js';

$(function() {
    const tagName = args.TagName;
    const client = new MicroCmsApiClient(args.ServiceDomain, args.ApiKey);
    const fields = ['id', 'tag', 'title', 'publishedAt'];
    const htconv = new HtmlConvertTool(fields, {
        title: 'escape', publishedAt: 'dateFormat', tag: 'arrayFirst'});
    
    client.getList(
        'news', fields.join(','), `tag[contains]${tagName}`, '-publishedAt', 4
    ).then((res) => {
        const html = htconv.toHtml($("#list_news_item").html(), res.contents);
        $("#list_news_item").html(html);
    });
    
    setTimeout(() => { $("#loading").addClass('loaded'); }, 500);
});
