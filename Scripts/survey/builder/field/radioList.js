﻿/*
*
* radio list field
* author: ronglin
* create date: 2010.06.29
*
*/

(function ($) {

    // text resource
    var options = {
        fieldTitle: 'Single Choice',
        choicesGroupName: 'Choices',
        choicesTipCaption: 'Choices',
        choicesTipContent: 'Use the plus or minus icons to add or delete choices. Click on the star to make a choice the default selection.',
        emptyChoicesMsg: 'Can not delete all choices.',
        firstOption: 'First option',
        secondOption: 'Second option',
        thirdOption: 'Third option',
        btnAddTitle: 'Add',
        btnDeleteTitle: 'Delete',
        btnMakeDefaultTitle: 'Make Default',
        btnMoveTitle: 'Move'
    };

    // override text resource
    if (window.__localization) { $.extend(options, __localization.radioList_js); }

    /*
    * radioList
    */
    var radioList = function (config) {
        radioList.superclass.constructor.call(this, config);
    };

    yardi.extend(radioList, yardi.baseField, {

        indexKey: -1,

        getInputId: function () {
            return this.fieldName + '_' + this.indexKey;
        },

        serialize: function (base) {
            if (base != false) radioList.superclass.serialize.call(this);
            this.el.attr('indexKey', this.indexKey);
        },

        deserialize: function () {
            radioList.superclass.deserialize.call(this);
            this.indexKey = parseInt(this.el.attr('indexKey'), 10);
        },

        buildHtml: function () {
            var html = [];
            html.push('<div class="s-field s-radiolist">');
            yardi.baseSnippets.fieldCommon(html, this, options.fieldTitle);
            html.push('<div class="group">');
            this.indexKey++;
            html.push('<div class="item">');
            html.push('<input #{sync}="' + this.indexKey + '" name="#{n}" id="' + this.getInputId() + '" type="radio" value="' + options.firstOption + '"/>');
            html.push('<label #{sync}="' + this.indexKey + '" for="' + this.getInputId() + '" empty="false" class="custext">' + options.firstOption + '</label>');
            html.push('</div>');
            this.indexKey++;
            html.push('<div class="item">');
            html.push('<input #{sync}="' + this.indexKey + '" name="#{n}" id="' + this.getInputId() + '" type="radio" value="' + options.secondOption + '"/>');
            html.push('<label #{sync}="' + this.indexKey + '" for="' + this.getInputId() + '" empty="false" class="custext">' + options.secondOption + '</label>');
            html.push('</div>');
            this.indexKey++;
            html.push('<div class="item">');
            html.push('<input #{sync}="' + this.indexKey + '" name="#{n}" id="' + this.getInputId() + '"  type="radio" value="' + options.thirdOption + '"/>');
            html.push('<label #{sync}="' + this.indexKey + '" for="' + this.getInputId() + '" empty="false" class="custext">' + options.thirdOption + '</label>');
            html.push('</div>');
            html.push('</div>');
            yardi.baseSnippets.comment.f(html, this);
            html.push('</div>');
            return html.join('');
        },

        buildProHtml: function () {
            var html = [];
            html.push('<div class="s-field-pro s-radiolist-pro">');
            yardi.baseSnippets.fieldtitle.p(html, this);
            html.push('<div class="baserow">');
            html.push('<fieldset class="choices">');
            html.push('<legend><span groupfor="items">' + options.choicesGroupName + '</span> #{choicesTip}</legend>');
            html.push('<ul group="items">');
            var self = this;
            $('input[type=radio]', this.el).each(function () {
                var name = $(this).next().attr(self.fAttr());
                var checkedImg = $(this).attr('checked') ? 'star.gif' : 'stardim.gif';
                html.push('<li>');
                html.push('<input #{sync}="' + name + '" type="text" maxlength="250" autocomplete="off" />');
                html.push('<img title="' + options.btnAddTitle + '" alt="Add" src="#{img}/add.gif" />');
                html.push('<img title="' + options.btnDeleteTitle + '" alt="Delete" src="#{img}/delete.gif" />');
                html.push('<img title="' + options.btnMakeDefaultTitle + '" alt="Make Default" src="#{img}/' + checkedImg + '" />');
                html.push('<img title="' + options.btnMoveTitle + '" style="cursor: move;" alt="Move" src="#{img}/move.gif" />');
                html.push('</li>');
            });
            html.push('</ul>');
            html.push('</fieldset>');
            html.push('</div>');
            yardi.baseSnippets.guideline.p(html, this);
            yardi.baseSnippets.comment.p(html, this);
            yardi.baseSnippets.required.p(html, this);
            html.push('</div>');
            return html.join('');
        },

        _copyItem: function (source) {
            this.indexKey++;
            this.serialize(false);
            // add property
            var propertyParent = source.parent();
            var propertyCloned = propertyParent.clone(false).empty().insertAfter(propertyParent)
            propertyParent.children().clone(true).appendTo(propertyCloned);
            propertyCloned.children('input').attr(this.pAttr(), this.indexKey).val('').focus();
            propertyCloned.children('img[alt=Make Default]').each(function () {
                $(this).attr('src', $(this).attr('src').replace('star.gif', 'stardim.gif'));
            });
            // add field
            var refName = source.siblings('input').attr(this.pAttr());
            var fieldParent = this.fItems(refName).parent();
            var fieldCloned = fieldParent.clone(true).insertAfter(fieldParent);
            fieldCloned.children('input').attr('checked', false).removeAttr('CHECKED').attr(this.fAttr(), this.indexKey).attr('id', this.getInputId());
            fieldCloned.children('label').html('&nbsp;').attr(this.fAttr(), this.indexKey).attr('for', this.getInputId());
        },

        _deleteItem: function (source) {
            if ($('img[alt=Delete]', this.proEl).length == 1) {
                alert(options.emptyChoicesMsg);
            } else {
                // remove field
                var refName = source.siblings('input').attr(this.pAttr());
                this.fItems(refName).parent().remove();
                // remove property
                source.parent().remove();
            }
        },

        _selectItem: function (source) {
            // current src
            var oldsrc = source.attr('src');
            var checked = (oldsrc.indexOf('star.gif') > -1);
            // unselect all
            $('input[type=radio]', this.el).attr('checked', false).removeAttr('CHECKED');
            $('img[alt=Make Default]', this.proEl).attr('src', oldsrc.replace('star.gif', 'stardim.gif'));
            // ...
            if (checked) { return; }
            // set checked
            source.attr('src', oldsrc.replace('stardim.gif', 'star.gif'));
            var refName = source.siblings('input').attr(this.pAttr());
            this.fItems(refName).prev().attr('checked', true).attr('CHECKED', 'checked');
        },

        initPro: function () {
            radioList.superclass.initPro.call(this);
            var self = this, _dragging = false, _refName;
            // buttons
            $('img[alt=Add]', this.proEl).click(function () {
                if (!_dragging) { self._copyItem($(this)); }
            });
            $('img[alt=Delete]', this.proEl).click(function () {
                if (!_dragging) { self._deleteItem($(this)); }
            });
            $('img[alt=Make Default]', this.proEl).click(function () {
                if (!_dragging) { self._selectItem($(this)); }
            });
            // sortable
            $('ul', this.proEl).sortable({
                axis: 'y',
                revert: true,
                distance: 5,
                containment: this.proEl,
                forcePlaceholderSize: true,
                placeholder: 'holder',
                start: function (event, ui) {
                    _dragging = true;
                    _refName = ui.helper.children('input').attr(self.pAttr());
                    // fix revert position bug
                    ui.helper.css('left', ui.originalPosition.left);
                },
                stop: function (event, ui) {
                    var fTarget = self.fItems(_refName).parent();
                    var pNext = ui.item.get(0).nextSibling;
                    if (pNext) {
                        var nextName = $(pNext).children('input').attr(self.pAttr());
                        var nextTarget = self.fItems(nextName).parent();
                        fTarget.insertBefore(nextTarget);
                    } else {
                        fTarget.parent().append(fTarget);
                    }
                    _dragging = false;
                }
            });
        },

        getTips: function () {
            var tipsData = radioList.superclass.getTips.call(this);
            return $.extend(tipsData, {
                choicesTip: {
                    title: options.choicesTipCaption,
                    message: options.choicesTipContent
                }
            });
        }

    });

    // register
    yardi.baseField.register('radioList', radioList);

})(jQuery);
