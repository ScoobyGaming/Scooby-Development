
#You can insert this data or do so in the admin page!
INSERT INTO organization_type(name, description, "createdAt", "updatedAt")
    VALUES ('Casino', 'Standard casino organization which is within a regulation', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO organization_type(name, description, "createdAt", "updatedAt")
    VALUES ('Bar', 'A sports bar of bar which offers free or paid dfs.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO organization_type(name, description, "createdAt", "updatedAt")
    VALUES ('Online Casino', 'A casino which is only present online.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO organization_type(name, description, "createdAt", "updatedAt")
    VALUES ('Hotel', 'A hotel that has limited gaming.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


INSERT INTO address_types(name, description, "createdAt", "updatedAt")
    VALUES ('Primary', 'The main headquarters for a organization', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO address_types(name, description, "createdAt", "updatedAt")
    VALUES ('Secondary', 'A non headquarters for a organization', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

#set all users to password = password
UPDATE public.employee_user
	SET password='sha1$864f5f30$1$fe38b7457a4c2e466f635a3382a207570298d0e2';

UPDATE public.patron_player
	SET password='sha1$864f5f30$1$fe38b7457a4c2e466f635a3382a207570298d0e2';


	