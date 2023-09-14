<?php

namespace DAMBundle;

use Pimcore\Extension\Bundle\AbstractPimcoreBundle;

class DAMBundle extends AbstractPimcoreBundle
{
    public function getJsPaths()
    {
        return [
            '/bundles/dam/js/pimcore/startup.js',
            // '/bundles/dam/js/pimcore/material.js',
            '/bundles/dam/js/pimcore/checkProcessBar.js',
            '/bundles/dam/js/pimcore/checkProcessPanel.js',
            '/bundles/dam/js/pimcore/checkProcessItem.js'
        ];
    }
}
