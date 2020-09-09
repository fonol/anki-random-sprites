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
from aqt.utils import tooltip
import os
import re
import typing
import base64
import time
from typing import Any, Optional, Tuple

def init_addon():
    """ Add action to "Tools" menu and register hook to check for _procgen.js file. """

    tools_item = QAction("Random Sprites", mw)
    tools_item.triggered.connect(open_main_dialog)
    mw.form.menuTools.addAction(tools_item)

    gui_hooks.collection_did_load.append(after_collection_did_load)
    gui_hooks.webview_did_receive_js_message.append(expanded_on_bridge_cmd)



def after_collection_did_load(col: "Collection"):
    """ Check if add-on js file is in media folder, if not, insert it. """

    if not mw.col.media.have("_procgen.js"):
        mw.col.media.addFile(addon_folder() + "_procgen.js")

def open_main_dialog():
    """ Open the add-on's info dialog. """

    InfoDialog(mw)

def expanded_on_bridge_cmd(handled: Tuple[bool, Any], cmd: str, self: Any) -> Tuple[bool, Any]:

    if cmd.startswith("procgen-save "):
        b64 = cmd[13:]
        if b64.startswith("data:image/png;base64,"):
            b64 = b64[len("data:image/png;base64,"):]
        if b64:
            name = f"{files_save_folder()}{int(time.time())}.png"
            if not os.path.isdir(files_save_folder()):
                os.mkdir(files_save_folder()) 
            with open(name, "wb") as fh:
                fh.write(base64.b64decode(b64))
            tooltip(f"Saved.")
        return (True, None)

    return handled


def addon_folder() -> str:
    """ Absolute path to add-on folder. """

    dir = os.path.dirname(os.path.realpath(__file__)).replace("\\", "/")
    if not dir.endswith("/"):
        return dir + "/"
    return dir

def files_save_folder() -> str:
    """ Absolute path to add-on user_files folder. """
    return addon_folder() + "user_files/"


class SettingsTab(QWidget):

    def __init__(self, parent):
        super(QWidget, self).__init__(parent)
        self.config = mw.addonManager.getConfig(__name__) 
        self.setup_ui()


    def setup_ui(self):
        layout = QVBoxLayout()
        self.use_animation_cb = QCheckBox("Use Render Animation")
        self.use_animation_cb.setChecked(self.config["use_render_animation"])
        self.use_animation_cb.stateChanged.connect(self.update_render_animation)
        layout.addWidget(QLabel("Should there be a short animation when the image is rendered?"))
        layout.addWidget(self.use_animation_cb)
        layout.addSpacing(20)

        self.effects_cb = QCheckBox("Random animated effects")
        self.effects_cb.setChecked(self.config["use_effect_animation"])
        self.effects_cb.stateChanged.connect(self.update_effect_animation)
        layout.addWidget(QLabel("Should there be a (random) animation effect after the image is rendered?"))
        layout.addWidget(self.effects_cb)
        layout.addSpacing(20)

        hbox = QHBoxLayout()
        replace_btn = QPushButton("Replace Script")
        replace_btn.clicked.connect(self.replace_js_file)
        hbox.addStretch(1)
        hbox.addWidget(replace_btn)
        hbox.addStretch(1)
        layout.addStretch(1)
        line = QFrame()
        line.setFrameShape(QFrame.HLine)
        line.setFrameShadow(QFrame.Sunken) 
        layout.addWidget(line)
        layout.addSpacing(10)
        layout.addWidget(QLabel("Replaces the script (_procgen.js) in Anki's media folder with the current settings"))
        layout.addSpacing(10)
        layout.addLayout(hbox)
        self.setLayout(layout)

    def update_render_animation(self, state):
        self.config["use_render_animation"] = self.use_animation_cb.isChecked()
        mw.addonManager.writeConfig(__name__, self.config)

    def update_effect_animation(self, state):
        self.config["use_effect_animation"] = self.effects_cb.isChecked()
        mw.addonManager.writeConfig(__name__, self.config)
    
    def replace_js_file(self):
        """ Replace the _procgen.js file in the media folder with the file contained in the add-on folder. """

        use_animation   = self.use_animation_cb.isChecked()
        use_effect      = self.effects_cb.isChecked()

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
                line = re.sub("USE_RENDER_ANIMATION = ?(false|true)", "USE_RENDER_ANIMATION = " + str(use_animation).lower(), line)
                line = re.sub("USE_EFFECT_ANIMATION = ?(false|true)", "USE_EFFECT_ANIMATION = " + str(use_effect).lower(), line)
                outfile.write(line)

        mw.col.media.addFile(addon_folder() + "_procgen.js")

        os.remove(addon_folder() + "_procgen.js")
        os.rename(addon_folder() + "_procgen_orig.js", addon_folder() + "_procgen.js")
        tooltip(f"Replaced file in media folder.")

class InfoTab(QWidget):

    def __init__(self, parent):
        super(QWidget, self).__init__(parent)
        self.setup_ui()

    def setup_ui(self):

        layout = QVBoxLayout()
        s_lbl = QLabel("<b>How to setup:</b>")
        s_lbl.setAlignment(Qt.AlignCenter)
        layout.addWidget(s_lbl)

        layout.addWidget(QLabel("""
Paste the following snippet into the card type of your choice.
I recommend only inserting it on the backside, so that the image is shown
after you answered a card.
        """))

        lbl_1 = QLabel("1. Insert this where you want the image to appear:")
        lbl_1.setStyleSheet("border: 3px solid #2496dc;")
        layout.addWidget(lbl_1)
        le_1 = QLineEdit()
        le_1.setText("<div id='procgen_canvas'></div>")
        le_1.setReadOnly(True)
        layout.addWidget(le_1)
        layout.addSpacing(15)

        lbl_2 = QLabel("2. This will execute the script and fill 'procgen_canvas' with the image:")
        lbl_2.setStyleSheet("border: 3px solid #2496dc;")
        layout.addWidget(lbl_2)
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
        layout.addSpacing(15)

        lbl_3 = QLabel("E.g. an example back side would look like:")
        lbl_3.setStyleSheet("border: 3px solid #2496dc;")
        layout.addWidget(lbl_3)
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
        self.setLayout(layout)



class InfoDialog(QDialog):
    """ Can be opened in the Tools menu, displays some help. """

    def __init__(self, parent):
        QDialog.__init__(self, parent, Qt.WindowSystemMenuHint | Qt.WindowTitleHint | Qt.WindowCloseButtonHint | Qt.WindowMaximizeButtonHint)

        self.mw         = aqt.mw
        self.parent     = parent

        self.setup_ui()
        self.setWindowTitle("Random Sprites")

    def setup_ui(self):

        layout              = QVBoxLayout()
        self.setLayout(layout)
        self.tabs           = QTabWidget()
        self.tab_settings   = SettingsTab(self) 
        self.tab_info       = InfoTab(self) 

        self.tabs.addTab(self.tab_settings, "Settings")
        self.tabs.addTab(self.tab_info, "Info")
        self.layout().addWidget(self.tabs)

        close = QPushButton("Close")
        close.clicked.connect(self.accept)
        hbottom = QHBoxLayout()
        hbottom.addStretch(1)
        hbottom.addWidget(close)
        layout.addLayout(hbottom)
        self.show()


    






init_addon()