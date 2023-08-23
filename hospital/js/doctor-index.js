import * as args from './microcms/microcms-args.js';
import { MicroCmsApiClient, HtmlConvertTool } from './microcms/microcms-tools.js';

$(function() {
    const tagName = args.TagName;
    const client = new MicroCmsApiClient(args.ServiceDomain, args.ApiKey);
    const fields = [
        'id', 'tag', 'title', 'full_name', 'english_name', 'picture', 'content', 'bd_select'];
    const htconv = new HtmlConvertTool(fields, {
        tag: 'arrayFirst', picture: 'pictureUrl', title: 'escape', full_name: 'escape', english_name: 'escape', content: 'escape'});
    
    client.getList(
        'doctor', fields.join(','), `tag[contains]${tagName}`, '', 1000
    ).then((res) => {
        let html = $("#list_doctor_item").html();
        html = htconv.toHtml(html, res.contents);
        html = html.replaceAll('%img-src-attr%', 'src');
        $("#list_doctor_item").html(html);
    });
    
    setTimeout(() => { $("#loading").addClass('loaded'); }, 500);
});
