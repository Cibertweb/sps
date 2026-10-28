<!DOCTYPE html>
<html lang="es">
<?php include 'includes/head.php'; ?>
<body>

    <!-- Header / Navbar -->
    <?php include 'includes/header.php'; ?>

    <!-- Contenedor Principal SPA -->
    <main class="container">
        <?php include 'inicio.php'; ?>
        <?php include 'includes/views/podcasts.php'; ?>
        <?php include 'includes/views/videos.php'; ?>
        <?php include 'includes/views/favoritos.php'; ?>
        <?php include 'includes/views/detalle.php'; ?>
        <?php include 'includes/views/video.php'; ?>
    </main>

    <!-- Reproductor Flotante -->
    <?php include 'includes/audio-player.php'; ?>

    <!-- Footer -->
    <?php include 'includes/footer.php'; ?>

    <!-- Librerías JS y Scripts Propios -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="data.js"></script>
    <script src="main.js"></script>
</body>
</html>