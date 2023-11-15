-- Task one Queries
-- Query 1
INSERT INTO public.account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES(
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
-- Query 2
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;
-- Query 3
DELETE FROM public.account
WHERE account_id = 1;
-- Query 4
UPDATE public.inventory
set inv_description = replace(
        inv_description,
        'small interiors',
        'a huge interior'
    )
where inv_make = 'GM'
    and inv_model = 'Hummer';
-- Query 5
SELECT i.inv_make,
    i.inv_model,
    c.classification_name
FROM public.inventory i
    INNER JOIN public.classification c on i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';
-- Query 6
UPDATE public.inventory
SET inv_image = replace(inv_image, 'images/', 'images/vehicles/'),
    inv_thumbnail = replace(inv_thumbnail, 'images/', 'images/vehicles/');