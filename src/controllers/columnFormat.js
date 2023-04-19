
import Store from '../store';
import { replaceHtml, transformRangeToAbsolute, openSelfModel } from '../utils/util';
import { modelHTML } from './constant';
import sheetmanage from './sheetmanage';
import menuButton from './menuButton';
import { checkProtectionNotEnable } from './protection';
import { jfrefreshgrid } from '../global/refresh';
import locale from '../locale/locale';
import { setcellvalue } from '../global/setdata';

let isInitialColumnFormatModel = false;

function initialColumnFormatModelEvent() {
    const _locale = locale();
    const local_columnFormat = _locale.columnFormat;

    $("#luckysheet-columnFormat-confirm").click(function () {
        let locked = $("#luckysheet-protection-check-locked").is(':checked');
        let hidden = $("#luckysheet-protection-check-hidden").is(':checked');

        locked = locked == true ? 1 : 0;
        hidden = hidden == true ? 1 : 0;

        let d = recycleSeletion(
            function (cell, r, c, data) {
                if (cell == null) {
                    setcellvalue(r, c, data, {
                        lo: locked,
                        hi: hidden
                    });
                }
                else {
                    cell.lo = locked;
                    cell.hi = hidden;
                }
            },
            function () {
                alert(local_columnFormat.sheetDataIsNullAlert);
            }
        );

        jfrefreshgrid(d, undefined, undefined, false);

        $("#luckysheet-columnFormat-config").hide();
        $("#luckysheet-modal-dialog-mask").hide();
    });
}

function recycleSeletion(cycleFunction, dataIsNullFunction) {
    if (Store.luckysheet_select_save != null && Store.luckysheet_select_save.length > 0) {
        let sheetFile = sheetmanage.getSheetByIndex(), data = sheetFile.data;
        if (data != null) {

            for (let i = 0; i < Store.luckysheet_select_save.length; i++) {
                let selection = Store.luckysheet_select_save[i];
                let row = selection.row, column = selection.column;
                for (let r = row[0]; r <= row[1]; r++) {
                    for (let c = column[0]; c <= column[1]; c++) {
                        let cell;

                        let margeset = menuButton.mergeborer(data, r, c);
                        if (!!margeset) {
                            // row = margeset.row[1];
                            // row_pre = margeset.row[0];
                            let row_index = margeset.row[2];
                            // row_index_ed = margeset.row[3];

                            // col = margeset.column[1];
                            // col_pre = margeset.column[0];
                            let col_index = margeset.column[2];
                            // col_index_ed = margeset.column[3];

                            cell = data[row_index][col_index];
                        }
                        else {
                            cell = data[r][c];
                        }

                        // if(cell.lo==null || cell.lo==1){
                        //     locked = true;
                        //     lockedCount++;
                        // }

                        // if(cell.hi==1){
                        //     hidden = true;
                        //     hiddenCount++;
                        // }

                        // count++;

                        cycleFunction(cell, r, c, data);
                    }
                }
            }
        }
        else {
            // locked = true;
            dataIsNullFunction();
        }

        return data;
    }
}

function initialColumnFormatModel() {
    if (isInitialColumnFormatModel) {
        return;
    }

    isInitialColumnFormatModel = true;
    const _locale = locale();
    const local_columnFormat = _locale.columnFormat;
    const locale_button = _locale.button;

    //Password input initial
    $("body").append(replaceHtml(modelHTML, {
        "id": "luckysheet-columnFormat-config",
        "addclass": "luckysheet-columnFormat-config",
        "title": local_columnFormat.columnFormatTitle,
        "content": `
                <div class="luckysheet-columnFormat-menu-c">
                    <div class="luckysheet-columnFormat-menu luckysheet-columnFormat-menu-active" id="luckysheet-columnFormat-protection">
                        ${local_columnFormat.columnFormatType}
                    </div>
                </div>
                <div id="luckysheet-columnFormat-protection-content" class="luckysheet-columnFormat-content">
                <div class="luckysheet-columnFormat-protection">
                    <div role="radiogroup" class="el-radio-group">
                        <label role="radio" tabindex="-1" class="el-radio-button">
                            <input type="radio" tabindex="-1" autocomplete="off" class="el-radio-button__orig-radio" value="date">
                            <span class="el-radio-button__inner">${local_columnFormat.FormatTypeDate}</span>
                        </label>
                        <label role="radio" tabindex="-1" class="el-radio-button">
                            <input type="radio" tabindex="-1" autocomplete="off" class="el-radio-button__orig-radio" value="time">
                            <span class="el-radio-button__inner">${local_columnFormat.FormatTypeTime}</span>
                        </label>
                        <label role="radio" tabindex="-1" class="el-radio-button">
                            <input type="radio" tabindex="-1" autocomplete="off" class="el-radio-button__orig-radio" value="string">
                            <span class="el-radio-button__inner">${local_columnFormat.FormatTypeText}</span>
                        </label>
                        <label role="radio" tabindex="0" class="el-radio-button is-active" aria-checked="true">
                            <input type="radio" tabindex="-1" autocomplete="off" class="el-radio-button__orig-radio" value="number">
                            <span class="el-radio-button__inner">${local_columnFormat.FormatTypeNumber}</span>
                        </label>
                    </div>
                    <div class="FieldDataTypeSetting-m__advancedForms--hTfHa">
                        <div class="PureFieldForm-m__dimtypeContainer--lOFvc">
                            <div class="el-form-item">
                                <div class="el-form-item__content">
                                    <label class="el-checkbox">
                                        <span class="el-checkbox__input">
                                            <span class="el-checkbox__inner"></span>
                                            <input type="checkbox" aria-hidden="false" class="el-checkbox__original" value="">
                                        </span>
                                        <span class="el-checkbox__label">固定小数位数</span>
                                    </label>
                                </div>
                            </div>
                            <div class="el-form-item PureFieldForm-m__percentBox--nFf5T">
                                <label class="el-form-item__label">显示为分数</label>
                                <div class="el-form-item__content">
                                    <div role="radiogroup" class="el-radio-group">
                                        <label role="radio" aria-checked="true" tabindex="0"
                                            class="el-radio is-checked PureFieldForm-m__percentLabel--A0C4z">
                                            <span class="el-radio__input is-checked">
                                                <span class="el-radio__inner"></span>
                                                <input type="radio" aria-hidden="true" tabindex="-1" autocomplete="off"
                                                    class="el-radio__original" value="">
                                            </span>
                                            <span class="el-radio__label">不显示为分数</span>
                                        </label>
                                        <label role="radio" tabindex="-1" class="el-radio PureFieldForm-m__percentLabel--A0C4z">
                                            <span class="el-radio__input">
                                                <span class="el-radio__inner"></span>
                                                <input type="radio" aria-hidden="true" tabindex="-1" autocomplete="off"
                                                    class="el-radio__original" value="hundredth">
                                            </span>
                                            <span class="el-radio__label">百分位<!----></span>
                                        </label>
                                        <label role="radio" tabindex="-1" class="el-radio PureFieldForm-m__percentLabel--A0C4z">
                                            <span class="el-radio__input">
                                                <span class="el-radio__inner"></span>
                                                <input type="radio" aria-hidden="true" tabindex="-1" autocomplete="off"
                                                    class="el-radio__original" value="thousandth">
                                            </span>
                                            <span class="el-radio__label">千分位<!----></span>
                                        </label>
                                        <label role="radio" tabindex="-1" class="el-radio PureFieldForm-m__percentLabel--A0C4z">
                                            <span class="el-radio__input">
                                                <span class="el-radio__inner"></span>
                                                <input type="radio" aria-hidden="true" tabindex="-1" autocomplete="off"
                                                    class="el-radio__original" value="ten-thousandth">
                                            </span>
                                            <span class="el-radio__label">万分位<!----></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div class="el-form-item PureFieldForm-m__percentBox--nFf5T">
                                <label class="el-form-item__label">数字单位</label>
                                <div class="el-form-item__content">
                                    <div class="el-select el-select--small" style="width: 180px;">
                                        <div class="el-input el-input--small el-input--suffix">
                                            <input type="text" readonly="readonly" autocomplete="off" placeholder="请选择"
                                                class="el-input__inner">
                                            <span class="el-input__suffix">
                                                <span class="el-input__suffix-inner">
                                                    <i class="el-select__caret el-input__icon el-icon-arrow-up"></i>
                                                </span>
                                            </span>
                                        </div>
                                        <div class="el-select-dropdown el-popper" style="display: none; min-width: 180px;">
                                            <div class="el-scrollbar" style="">
                                                <div class="el-select-dropdown__wrap el-scrollbar__wrap"
                                                    style="margin-bottom: -8px; margin-right: -8px;">
                                                    <ul class="el-scrollbar__view el-select-dropdown__list">
                                                        <li class="el-select-dropdown__item selected"><span>不显示单位</span></li>
                                                        <li class="el-select-dropdown__item"><span>千</span></li>
                                                        <li class="el-select-dropdown__item"><span>万</span></li>
                                                        <li class="el-select-dropdown__item"><span>百万</span></li>
                                                        <li class="el-select-dropdown__item"><span>亿</span></li>
                                                    </ul>
                                                </div>
                                                <div class="el-scrollbar__bar is-horizontal">
                                                    <div class="el-scrollbar__thumb" style="transform: translateX(0%);"></div>
                                                </div>
                                                <div class="el-scrollbar__bar is-vertical">
                                                    <div class="el-scrollbar__thumb" style="transform: translateY(0%);"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="el-form-item">
                                <label class="el-form-item__label">展示单位</label>
                                <div class="el-form-item__content">
                                    <div class="el-input el-input--small" style="width: 180px;">
                                        <input type="text" autocomplete="off" class="el-input__inner">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,
        "botton": `<button id="luckysheet-columnFormat-confirm" class="btn btn-primary">${locale_button.confirm}</button>
                    <button class="btn btn-default luckysheet-model-close-btn">${locale_button.cancel}</button>`,
        "style": "z-index:100003"
    }));

    initialColumnFormatModelEvent();
}

export function openColumnFormatModel() {
    debugger
    initialColumnFormatModel();

    const _locale = locale();
    const local_columnFormat = _locale.columnFormat;
    const locale_button = _locale.button;

    $("#luckysheet-rightclick-menu").hide();

    if (!checkProtectionNotEnable(Store.currentSheetIndex)) {
        return;
    }

    let locked = false, hidden = false;
    let lockedCount = 0, hiddenCount = 0, count = 0;
    if (Store.luckysheet_select_save != null && Store.luckysheet_select_save.length > 0) {
        recycleSeletion(
            function (cell) {
                // let cell = data[r][c];
                if (cell == null || cell.lo == null || cell.lo == 1) {
                    locked = true;
                    lockedCount++;
                }

                if (cell != null && cell.hi == 1) {
                    hidden = true;
                    hiddenCount++;
                }

                count++;
            },
            function () {
                locked = true;
            }
        );
    }
    else {
        alert(local_columnFormat.selectionIsNullAlert);
        return;
    }

    let tipsLock = "", tipshidden = "";
    if (locked) {
        tipsLock = lockedCount == count ? local_columnFormat.tipsAll : local_columnFormat.tipsPart;
    }

    if (hidden) {
        tipshidden = hiddenCount == count ? local_columnFormat.tipsAll : local_columnFormat.tipsPart;
    }

    $("#luckysheet-protection-check-locked").prop('checked', locked).parent().next().html(tipsLock);
    $("#luckysheet-protection-check-hidden").prop('checked', hidden).parent().next().html(tipshidden);


    openSelfModel("luckysheet-columnFormat-config");
}