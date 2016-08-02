<?php

/**
 * @file
 * Template overrides for cecs_theme.
 */

/**
 * Implements hook_preprocess_flippy().
 */
function cecs_theme_preprocess_flippy(&$variables) {
  $variables['links']['prev']['classes'] = 'prev left';
  $variables['links']['next']['classes'] = 'next right';
}

/**
 * Implements hook_preprocess_block().
 */
function cecs_theme_preprocess_block(&$variables) {
  switch ($variables['block']->bid) {
    // Replace the default-menu-style class on Related menus.
    case 'menu-890b6da767434dba0080f1b040418247':
      // CECS.
    case 'menu-1473f020e619d1a54abe1fae5e14b673':
      // ENG.
    case 'menu-dce3d590ca102d2c20b0223504cedadd':
      // CS.
      $default_menu_style = theme_get_setting('acton_menu_style_default');
      // Handle classes_array.
      $key_classes = array_search($default_menu_style, $variables['classes_array']);
      if ($key_classes !== FALSE) {
        $variables['classes_array'][$key_classes] = 'menu-uni';
      }

      // Handle attributes_array.
      $key_attributes = array_search($default_menu_style, $variables['attributes_array']['class']);
      if ($key_attributes !== FALSE) {
        $variables['attributes_array']['class'][$key_attributes] = 'menu-uni';
      }
      break;

    default:
      break;
  }
}

/**
 * Implements hook_preprocess_field().
 */
function cecs_theme_preprocess_field(&$variables, $hook) {
  $element = $variables['element'];
  switch ($element['#field_name']) {
    case 'field_files':
      if ($element['#bundle'] == 'panel') {
        $variables['classes_array'][] = 'doublewide';
      }
      break;
  }
}
