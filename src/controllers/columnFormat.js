
import Store from '../store';
import sheetmanage from './sheetmanage';
import luckysheetConfigsetting from './luckysheetConfigsetting';
import method from '../global/method';


export function openColumnFormatModel() {
    debugger
    // 这里直接对外弹框好了，讲选中的列弹出去，然后在外面做弹框view和setValue的列类型修改
    if (luckysheetConfigsetting && luckysheetConfigsetting.hook && luckysheetConfigsetting.hook.sheetRightclickColumnFormat) {
        console.log('hook-columnFormatModal-进来了::>>')
        let file = sheetmanage.getSheetByIndex(), data = file.data;
        console.log(Store.luckysheet_select_save)
        console.log(Store.flowdata)
        console.log(data)
        const selection = Store.luckysheet_select_save[0];
        const start_c = selection.column[0];
        let targetSheetData = $.extend(true, [], file.data);
        if (targetSheetData.length == 0) {
            targetSheetData = sheetmanage.buildGridData(file);
        }

        let cellData = targetSheetData[1][start_c] || {};
        const itemFormatType = cellData['ct']

        method.createHookFunction("sheetRightclickColumnFormat", selection, {
            r: selection.row_focus,
            c: selection.column_focus,
            "start_r": selection.row[0],
            "start_c": selection.column[0],
            "end_r": selection.row[1],
            "end_c": selection.column[1]
        }, file, itemFormatType);
        // 这里要返回当前列的格式，给到弹框展示
        // 不应该一个个cell调用setCellFormat，参考下菜单里面的，怎么给整体selection设置format
        // let d = editor.deepCopyFlowData(Store.flowdata);//取数据
        // _this.updateFormat(d, "ct", "0.00%");
        // updateformat
    }

}