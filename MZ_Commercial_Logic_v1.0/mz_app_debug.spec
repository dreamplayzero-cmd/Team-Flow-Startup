# -*- mode: python ; coding: utf-8 -*-
block_cipher = None
a = Analysis(
    ['main.py'],
    datas=[
        ('assets', 'assets'),
        ('config', 'config'),
        ('ui', 'ui'),
        ('core', 'core'),
        ('data/schema.py', 'data'),
    ],
    hiddenimports=['PySide6.QtXml', 'shiboken6', 'PySide6.QtGui'],
    hookspath=[],
    runtime_hooks=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
 )
pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)
exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='MZ_Analyzer_Debug',
    debug=True,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=True, # Console enabled for debugging
)
