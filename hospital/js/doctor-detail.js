import * as args from './microcms/microcms-args.js';
import { MicroCmsApiClient, HtmlConvertTool, ObjectParseTool } from './microcms/microcms-tools.js';

$(function() {
    const client = new MicroCmsApiClient(args.ServiceDomain, args.ApiKey);
    const parser = new ObjectParseTool();
    const fields = [
        'id', 'tag', 'title', 'full_name', 'english_name', 'picture', 'content', 'bd_select', 'bd_picture', 'bd_content'];
    const htconv = new HtmlConvertTool(fields, {
        tag: 'arrayFirst', picture: 'pictureUrl', title: 'escape', full_name: 'escape', english_name: 'escape', bd_picture: 'pictureUrl'});

    const query = parser.parseQuery(window.location.search);
    let filterStr = `id[equals]${query.id}`;
    client.getList(
        'doctor', fields.join(','), filterStr, '', 1
    ).then((res) => {
        //title
        const title = htconv.toHtml($('title').html(), res.contents);
        $('title').html(title);
        //main-content
        let html = $("#main_doctor_item").html();
        html = htconv.toHtml(html, res.contents);
        html = html.replaceAll('%img-src-attr%', 'src');
        $("#main_doctor_item").html(html);
        //best-doctors
        if (0 < res.contents.length && res.contents[0].bd_select) {
            $('#bd_select1').removeAttr('hidden');
            $('#bd_select2').removeAttr('hidden');
        }
    });
    
    setTimeout(() => { $("#loading").addClass('loaded'); }, 500);
});
