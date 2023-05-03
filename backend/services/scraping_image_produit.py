import sys
import requests
import os

# Fonction pour récupérer l'URL de la meilleure image d'un produit donné par nom


def get_best_image_url(product_name):
    # Effectuer une requête à l'API Unsplash avec la requête de recherche personnalisée
    url = f"https://api.unsplash.com/search/photos?query={product_name}&client_id=N6BO5Z57_HtYp-AzWgmt90Rdzy6SqQIzPwtk7DMgmM8"
    response = requests.get(url)

    # Extraire l'URL de la première image
    data = response.json()
    image_url = data["results"][0]["urls"]["regular"]
    print("url de l'image: " + image_url)
    return image_url

# Fonction pour télécharger l'image à partir de l'URL


def download_image(image_url, directory, filename):
    # Créer un dossier pour les images si elle n'existe pas déjà
    print("dossier" + directory)
    if not os.path.exists(directory):
        # print("aaaa")
        os.makedirs(directory)

    # Effectuer une requête à l'URL de l'image et écrire le contenu dans un fichier local
    response = requests.get(image_url)
    # print("bbbb")
    filename = os.path.join(directory, filename)
    print(image_url.split("/")[-1])

    # print("cccc")
    with open(filename, 'wb') as f:
        # print("dddd")
        f.write(response.content)


# Utiliser les fonctions pour récupérer l'URL de la meilleure image et la télécharger
product_name = sys.argv[1]
image_url = get_best_image_url(product_name)
download_image(image_url, "../uploads", product_name + ".jpg")
