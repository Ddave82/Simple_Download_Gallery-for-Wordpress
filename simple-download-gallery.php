<?php
/*
Plugin Name: Simple Download Gallery
Description: Einfache Bildgalerie mit Download-Button und Lightbox-Funktion für jedes Bild.
Version: 1.1
Author: David + Nova
Text Domain: simple-download-gallery
*/

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Custom Post Type registrieren: Download-Galerie
 */
add_action( 'init', 'sdg_register_cpt' );
function sdg_register_cpt() {
    $labels = array(
        'name'               => 'Download-Galerie',
        'singular_name'      => 'Galeriebild',
        'add_new'            => 'Neues Bild hinzufügen',
        'add_new_item'       => 'Neues Galeriebild hinzufügen',
        'edit_item'          => 'Galeriebild bearbeiten',
        'new_item'           => 'Neues Galeriebild',
        'all_items'          => 'Alle Galeriebilder',
        'view_item'          => 'Galeriebild ansehen',
        'search_items'       => 'Galeriebilder durchsuchen',
        'not_found'          => 'Keine Galeriebilder gefunden',
        'not_found_in_trash' => 'Keine Galeriebilder im Papierkorb gefunden',
        'menu_name'          => 'Download-Galerie'
    );

    $args = array(
        'labels'             => $labels,
        'public'             => false,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'menu_position'      => 20,
        'menu_icon'          => 'dashicons-format-gallery',
        'supports'           => array( 'title', 'thumbnail' ),
        'has_archive'        => false,
        'rewrite'            => false,
    );

    register_post_type( 'sdg_item', $args );
}

/**
 * Thumbnails für unseren CPT sicherstellen
 */
add_action( 'after_setup_theme', 'sdg_add_thumb_support' );
function sdg_add_thumb_support() {
    add_theme_support( 'post-thumbnails', array( 'sdg_item' ) );
}

/**
 * Styles und Scripts einbinden
 */
add_action( 'wp_enqueue_scripts', 'sdg_enqueue_assets' );
function sdg_enqueue_assets() {
    wp_register_style(
        'sdg-styles',
        plugins_url( 'assets/sdg-styles.css', __FILE__ ),
        array(),
        '1.1'
    );
    wp_enqueue_style( 'sdg-styles' );

    wp_register_script(
        'sdg-lightbox',
        plugins_url( 'assets/sdg-lightbox.js', __FILE__ ),
        array(),
        '1.1',
        true
    );
    wp_enqueue_script( 'sdg-lightbox' );
}

/**
 * Shortcode: [download_gallery]
 */
add_shortcode( 'download_gallery', 'sdg_render_gallery' );
function sdg_render_gallery( $atts ) {
    $atts = shortcode_atts(
        array(
            'orderby' => 'date',
            'order'   => 'DESC',
        ),
        $atts,
        'download_gallery'
    );

    $query = new WP_Query( array(
        'post_type'      => 'sdg_item',
        'posts_per_page' => -1,
        'orderby'        => sanitize_key( $atts['orderby'] ),
        'order'          => $atts['order'] === 'ASC' ? 'ASC' : 'DESC',
    ) );

    ob_start();

    if ( $query->have_posts() ) : ?>
        <div class="sdg-gallery">
            <?php
            $index = 0;
            while ( $query->have_posts() ) : $query->the_post();
                $image_id = get_post_thumbnail_id();
                if ( ! $image_id ) {
                    continue;
                }
                $thumb_html = wp_get_attachment_image( $image_id, 'medium_large', false, array(
                    'class' => 'sdg-thumb',
                    'loading' => 'lazy'
                ) );
                $full_url = wp_get_attachment_url( $image_id );
                ?>
                <div class="sdg-item">
                    <div class="sdg-thumb-wrap">
                        <?php echo $thumb_html; ?>
                    </div>
                    <div class="sdg-meta">
                        <div class="sdg-title"><?php echo esc_html( get_the_title() ); ?></div>
                        <div class="sdg-buttons">
                            <button
                                class="sdg-view-button"
                                data-index="<?php echo esc_attr( $index ); ?>"
                                data-image="<?php echo esc_url( $full_url ); ?>"
                                data-title="<?php echo esc_attr( get_the_title() ); ?>"
                                aria-label="<?php echo esc_attr( sprintf( __( 'Bild anschauen: %s', 'simple-download-gallery' ), get_the_title() ) ); ?>">
                                <?php esc_html_e( 'Anschauen', 'simple-download-gallery' ); ?>
                            </button>
                            <a class="sdg-download-button" href="<?php echo esc_url( $full_url ); ?>" download>
                                <?php esc_html_e( 'Download', 'simple-download-gallery' ); ?>
                            </a>
                        </div>
                    </div>
                </div>
            <?php
            $index++;
            endwhile;
            wp_reset_postdata();
            ?>
        </div>
    <?php else : ?>
        <p>Keine Bilder in der Download-Galerie vorhanden.</p>
    <?php endif;

    return ob_get_clean();
}
