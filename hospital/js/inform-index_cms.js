import * as args from './microcms/microcms-args.js';
import { MicroCmsApiClient, HtmlConvertTool } from './microcms/microcms-tools.js';

$(function() {
    const tagName = args.TagName;
    const client = new MicroCmsApiClient(args.ServiceDomain, args.ApiKey);
    const fields = ['id', 'tag', 'title', 'thumbnail', 'publishedAt'];
    const htconv = new HtmlConvertTool(fields, {
        title: 'escape', publishedAt: 'dateFormat', tag: 'arrayFirst', thumbnail: 'pictureUrl'});
    
    client.getList(
        'inform', fields.join(','), `tag[contains]${tagName}`, '', 1000
    ).then((res) => {
        let html = $("#list_inform_item").html();
        html = htconv.toHtml(html, res.contents);
        html = html.replaceAll('%img-src-attr%', 'src');
        $("#list_inform_item").html(html);
    });
    
    setTimeout(() => { $("#loading").addClass('loaded'); }, 500);
});
