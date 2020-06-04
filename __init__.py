#!/usr/bin/env python
# -*- coding: utf-8 -*-

# anki-procgen-js
# Copyright (C) 2020 Tom Z.

# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.

# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.

# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

from aqt import mw, gui_hooks
from aqt.qt import *
import aqt
from aqt.utils import showInfo, tooltip
import os
import re
import typing

def init_addon():
    """ Add action to "Tools" menu and register hook to check for _procgen.js file. """

    tools_item = QAction("Random Sprites", mw)
    tools_item.triggered.connect(open_main_dialog)
    mw.form.menuTools.addAction(tools_item)

    gui_hooks.collection_did_load.append(after_collection_did_load)


def after_collection_did_load(col: "Collection"):
    """ Check if add-on js file is in media folder, if not, insert it. """

    if not mw.col.media.have("_procgen.js"):
        mw.col.media.addFile(addon_folder() + "_procgen.js")

def open_main_dialog():
    """ Open the add-on's info dialog. """

    InfoDialog(mw)

def addon_folder() -> str:
    """ Absolute path to add-on folder. """

    dir = os.path.dirname(os.path.realpath(__file__)).replace("\\", "/")
    if not dir.endswith("/"):
        return dir + "/"
    return dir

class InfoDialog(QDialog):
    """ Can be opened in the Tools menu, displays some help. """

    def __init__(self, parent):
        QDialog.__init__(self, parent, Qt.WindowSystemMenuHint | Qt.WindowTitleHint | Qt.WindowCloseButtonHint | Qt.WindowMaximizeButtonHint)

        self.mw         = aqt.mw
        self.parent     = parent

        self.setup_ui()
        self.setWindowTitle("Random Sprites - Info")

    def setup_ui(self):
        layout = QVBoxLayout()

        self.use_animation_cb = QCheckBox("Use Animation")
        self.use_animation_cb.setChecked(True)
        layout.addWidget(self.use_animation_cb)

        self.scale_inp = QSpinBox()
        self.scale_inp.setRange(1, 50)
        self.scale_inp.setSingleStep(1)
        self.scale_inp.setSuffix(" Pixel")
        self.scale_inp.setValue(10)
        sc_hb = QHBoxLayout()
        sc_hb.addWidget(QLabel("Scale (Default 10)"))
        sc_hb.addStretch(1)
        sc_hb.addWidget(self.scale_inp)
        layout.addLayout(sc_hb)

        hbox = QHBoxLayout()
        replace_btn = QPushButton("Replace Script")
        replace_btn.clicked.connect(self.replace_js_file)
        hbox.addStretch(1)
        hbox.addWidget(replace_btn)
        layout.addLayout(hbox)

        line = QFrame()
        line.setFrameShape(QFrame.HLine)
        line.setFrameShadow(QFrame.Sunken) 
        layout.addWidget(line)

        s_lbl = QLabel("<b>How to setup:</b>")
        s_lbl.setAlignment(Qt.AlignCenter)
        layout.addWidget(s_lbl)

        layout.addWidget(QLabel("""
Paste the following snippet into the card type of your choice.
I recommend only inserting it on the backside, so that the image is shown
after you answered a card.
        """))

        layout.addWidget(QLabel("1. Insert this where you want the image to appear:"))
        le_1 = QLineEdit()
        le_1.setText("<div id='procgen_canvas'></div>")
        le_1.setReadOnly(True)
        layout.addWidget(le_1)

        layout.addWidget(QLabel("2. This will execute the script and fill 'procgen_canvas' with the image:"))
        te_1 = QTextEdit()
        te_1.setPlainText("""<script>
const procgen_js = document.createElement('script');
procgen_js.src = '_procgen.js';
document.body.appendChild(procgen_js);
</script>
        """)
        te_1.setReadOnly(True)
        te_1.setMaximumHeight(100)
        layout.addWidget(te_1)
        # te_1.setFixedHeight(te_1.document().size().toSize().height() + 5)

        layout.addWidget(QLabel("E.g. an example back side would look like:"))
        te_2 = QTextEdit()
        te_2.setPlainText("""<div style='margin-bottom: 20px;' id='procgen_canvas'></div>

{{Front}}
<hr/>
{{Back}} 

<script>
const procgen_js = document.createElement('script');
procgen_js.src = '_procgen.js';
document.body.appendChild(procgen_js);
</script>""")
        te_2.setReadOnly(True)
        layout.addWidget(te_2)

        close = QPushButton("Close")
        close.clicked.connect(self.accept)
        hbottom = QHBoxLayout()
        hbottom.addStretch(1)
        hbottom.addWidget(close)
        layout.addLayout(hbottom)

        self.setLayout(layout)

        self.show()


    def replace_js_file(self):
        """ Replace the _procgen.js file in the media folder with the file contained in the add-on folder. """

        use_animation   = self.use_animation_cb.isChecked()
        scale           = self.scale_inp.value()

        if mw.col.media.have("_procgen.js"):
            mw.col.media.trash_files(["_procgen.js"])
        
        os.rename(addon_folder() + "_procgen.js", addon_folder() + "_procgen_orig.js")
        try:
            with open(addon_folder() + "_procgen.js", "x") as f:
                pass
        except FileExistsError:
            pass

        with open(addon_folder() + "_procgen_orig.js") as infile, open(addon_folder() + "_procgen.js", 'w') as outfile:
            for line in infile:
                line = re.sub("USE_ANIMATION = (false|true)", "USE_ANIMATION = " + str(use_animation).lower(), line)
                line = re.sub("SCALE = \\d+", f"SCALE = {scale}", line)
                outfile.write(line)

        mw.col.media.addFile(addon_folder() + "_procgen.js")

        os.remove(addon_folder() + "_procgen.js")
        os.rename(addon_folder() + "_procgen_orig.js", addon_folder() + "_procgen.js")
        tooltip(f"Replaced file in media folder.<br>SCALE = {scale}, USE_ANIMATION = {use_animation}")


init_addon()